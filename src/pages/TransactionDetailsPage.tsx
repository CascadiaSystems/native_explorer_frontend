import React from "react";
import { Link } from "react-router-dom";
import bs58 from "bs58";
import {
  useFetchTransactionStatus,
  useTransactionStatus,
  useTransactionDetails,
} from "providers/transactions";
import { useFetchTransactionDetails } from "providers/transactions/parsed";
import { useCluster, ClusterStatus } from "providers/cluster";
import {
  TransactionSignature,
  SystemProgram,
  SystemInstruction,
} from "@velas/web3";
import { SolBalance } from "utils";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { displayTimestamp } from "utils/date";
import { InfoTooltip } from "components/common/InfoTooltip";
import { Address } from "components/common/Address";
import { Signature } from "components/common/Signature";
import { intoTransactionInstruction } from "utils/tx";
import { FetchStatus } from "providers/cache";
import { Slot } from "components/common/Slot";
import { BigNumber } from "bignumber.js";
import { BalanceDelta } from "components/common/BalanceDelta";
import { TokenBalancesCard } from "components/transaction/TokenBalancesCard";
import { InstructionsSection } from "components/transaction/InstructionsSection";
import { ProgramLogSection } from "components/transaction/ProgramLogSection";
import { clusterPath } from "utils/url";
import ContentCard from "components/common/ContentCard";
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const AUTO_REFRESH_INTERVAL = 2000;
const ZERO_CONFIRMATION_BAILOUT = 5;
export const INNER_INSTRUCTIONS_START_SLOT = 46915769;

export type SignatureProps = {
  signature: TransactionSignature;
};

export const SignatureContext = React.createContext("");

enum AutoRefresh {
  Active,
  Inactive,
  BailedOut,
}

type AutoRefreshProps = {
  autoRefresh: AutoRefresh;
};

export function TransactionDetailsPage({ signature: raw }: SignatureProps) {
  let signature: TransactionSignature | undefined;

  try {
    const decoded = bs58.decode(raw);
    if (decoded.length === 64) {
      signature = raw;
    }
  } catch (err) {}

  const status = useTransactionStatus(signature);
  const [zeroConfirmationRetries, setZeroConfirmationRetries] =
    React.useState(0);

  let autoRefresh = AutoRefresh.Inactive;

  if (zeroConfirmationRetries >= ZERO_CONFIRMATION_BAILOUT) {
    autoRefresh = AutoRefresh.BailedOut;
  } else if (status?.data?.info && status.data.info.confirmations !== "max") {
    autoRefresh = AutoRefresh.Active;
  }

  React.useEffect(() => {
    if (
      status?.status === FetchStatus.Fetched &&
      status.data?.info &&
      status.data.info.confirmations === 0
    ) {
      setZeroConfirmationRetries((retries) => retries + 1);
    }
  }, [status]);

  React.useEffect(() => {
    if (
      status?.status === FetchStatus.Fetching &&
      autoRefresh === AutoRefresh.BailedOut
    ) {
      setZeroConfirmationRetries(0);
    }
  }, [status, autoRefresh, setZeroConfirmationRetries]);

  return (
    <>
      <Typography variant="h2" className="py-6">Transaction</Typography>
      {signature === undefined ? (
        <ErrorCard text={`Signature "${raw}" is not valid`} />
      ) : (
        <SignatureContext.Provider value={signature}>
          <StatusCard signature={signature} autoRefresh={autoRefresh} />
          <AccountsCard signature={signature} autoRefresh={autoRefresh} />
          <TokenBalancesCard signature={signature} />
          <InstructionsSection signature={signature} />
          <ProgramLogSection signature={signature} />
        </SignatureContext.Provider>
      )}
    </>
  );
}

function StatusCard({
  signature,
  autoRefresh,
}: SignatureProps & AutoRefreshProps) {
  const fetchStatus = useFetchTransactionStatus();
  const status = useTransactionStatus(signature);
  const details = useTransactionDetails(signature);
  const { firstAvailableBlock, status: clusterStatus } = useCluster();

  // Fetch transaction on load
  React.useEffect(() => {
    if (!status && clusterStatus === ClusterStatus.Connected) {
      fetchStatus(signature);
    }
  }, [signature, clusterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect to set and clear interval for auto-refresh
  React.useEffect(() => {
    if (autoRefresh === AutoRefresh.Active) {
      let intervalHandle: NodeJS.Timeout = setInterval(
        () => fetchStatus(signature),
        AUTO_REFRESH_INTERVAL
      );

      return () => {
        clearInterval(intervalHandle);
      };
    }
  }, [autoRefresh, fetchStatus, signature]);

  if (
    !status ||
    (status.status === FetchStatus.Fetching &&
      autoRefresh === AutoRefresh.Inactive)
  ) {
    return <LoadingCard />;
  } else if (status.status === FetchStatus.FetchFailed) {
    return (
      <ErrorCard retry={() => fetchStatus(signature)} text="Fetch Failed" />
    );
  } else if (!status.data?.info) {
    if (firstAvailableBlock !== undefined && firstAvailableBlock > 1) {
      return (
        <ErrorCard
          retry={() => fetchStatus(signature)}
          text="Not Found"
          subtext={`Note: Transactions processed before block ${firstAvailableBlock} are not available at this time`}
        />
      );
    }
    return <ErrorCard retry={() => fetchStatus(signature)} text="Not Found" />;
  }

  const { info } = status.data;

  const renderResult = () => {
    let statusClass = "success";
    let statusText = "Success";
    if (info.result.err) {
      statusClass = "warning";
      statusText = "Error";
    }

    return (
      <h3 className="mb-0">
        <span className={`badge badge-soft-${statusClass}`}>{statusText}</span>
      </h3>
    );
  };

  const fee = details?.data?.transaction?.meta?.fee;
  const transaction = details?.data?.transaction?.transaction;
  const blockhash = transaction?.message.recentBlockhash;
  const isNonce = (() => {
    if (!transaction || transaction.message.instructions.length < 1) {
      return false;
    }

    const ix = intoTransactionInstruction(
      transaction,
      transaction.message.instructions[0]
    );
    return (
      ix &&
      SystemProgram.programId.equals(ix.programId) &&
      SystemInstruction.decodeInstructionType(ix) === "AdvanceNonceAccount"
    );
  })();

  return (
    <ContentCard
      title={<Typography variant="h3">Overview</Typography>}
      action={(
        <div className="flex flex-row items-center gap-2">
          <Button variant="outlined" component={Link}
            size="small"
            to={clusterPath(`/tx/${signature}/inspect`)}
            startIcon={<FontAwesomeIcon icon={faGear} />}
          >
            Inspect
          </Button>
          {autoRefresh === AutoRefresh.Active ? (
            <span className="spinner-grow spinner-grow-sm"></span>
          ) : (
            <Button
              variant="outlined" size="small"
              onClick={() => fetchStatus(signature)}
              startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
            >
              Refresh
            </Button>
          )}
        </div>
      )}
    >
      <TableContainer>
        <Table>
        <TableBody>
          <TableRow>
            <TableCell>Signature</TableCell>
            <TableCell align="right">
              <Signature signature={signature} alignRight />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Result</TableCell>
            <TableCell align="right">{renderResult()}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell align="right">
              {info.timestamp !== "unavailable" ? (
                <span className="text-monospace">
                  {displayTimestamp(info.timestamp * 1000)}
                </span>
              ) : (
                <InfoTooltip
                  bottom
                  right
                  text="Timestamps are only available for confirmed blocks"
                >
                  Unavailable
                </InfoTooltip>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Confirmation Status</TableCell>
            <TableCell align="right">
              {info.confirmationStatus || "Unknown"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Confirmations</TableCell>
            <TableCell align="right">{info.confirmations}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Block</TableCell>
            <TableCell align="right">
              <Slot slot={info.slot} link />
            </TableCell>
          </TableRow>

          {blockhash && (
            <TableRow>
              <TableCell>
                {isNonce ? (
                  "Nonce"
                ) : (
                  <InfoTooltip text="Transactions use a previously confirmed blockhash as a nonce to prevent double spends">
                    Recent Blockhash
                  </InfoTooltip>
                )}
              </TableCell>
              <TableCell align="right">{blockhash}</TableCell>
            </TableRow>
          )}

          {fee && (
            <TableRow>
              <TableCell>Fee (VLX)</TableCell>
              <TableCell align="right">
                <SolBalance lamports={fee} />
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function AccountsCard({
  signature,
  autoRefresh,
}: SignatureProps & AutoRefreshProps) {
  const details = useTransactionDetails(signature);
  const fetchDetails = useFetchTransactionDetails();
  const fetchStatus = useFetchTransactionStatus();
  const refreshDetails = () => fetchDetails(signature);
  const refreshStatus = () => fetchStatus(signature);
  const transaction = details?.data?.transaction?.transaction;
  const message = transaction?.message;
  const status = useTransactionStatus(signature);

  // Fetch details on load
  React.useEffect(() => {
    if (status?.data?.info?.confirmations === "max" && !details) {
      fetchDetails(signature);
    }
  }, [signature, details, status, fetchDetails]);

  if (!status?.data?.info) {
    return null;
  } else if (autoRefresh === AutoRefresh.BailedOut) {
    return (
      <ErrorCard
        text="Details are not available until the transaction reaches MAX confirmations"
        retry={refreshStatus}
      />
    );
  } else if (autoRefresh === AutoRefresh.Active) {
    return (
      <ErrorCard text="Details are not available until the transaction reaches MAX confirmations" />
    );
  } else if (!details || details.status === FetchStatus.Fetching) {
    return <LoadingCard className="mt-6" />;
  } else if (details.status === FetchStatus.FetchFailed) {
    return <ErrorCard retry={refreshDetails} text="Failed to fetch details" className="mt-6" />;
  } else if (!details.data?.transaction || !message) {
    return <ErrorCard text="Details are not available" className="mt-6" />;
  }

  const { meta } = details.data.transaction;
  if (!meta) {
    return <ErrorCard text="Transaction metadata is missing" />;
  }

  const accountRows = message.accountKeys.map((account, index) => {
    const pre = meta.preBalances[index];
    const post = meta.postBalances[index];
    const pubkey = account.pubkey;
    const key = account.pubkey.toBase58();
    const delta = new BigNumber(post).minus(new BigNumber(pre));

    return (
      <TableRow key={key}>
        <TableCell>
          <Address pubkey={pubkey} link />
        </TableCell>
        <TableCell>
          <BalanceDelta delta={delta} isSol />
        </TableCell>
        <TableCell align="right">
          <SolBalance lamports={post} />
        </TableCell>
        <TableCell align="right">
          {index === 0 && (
            <Chip label="Fee Payer" variant="filled" className="ml-1"/>
            )}
          {!account.writable && (
            <Chip label="Readonly" variant="filled" className="ml-1"/>
            )}
          {account.signer && (
            <Chip label="Signer" variant="filled" className="ml-1"/>
            )}
          {message.instructions.find((ix) => ix.programId.equals(pubkey)) && (
            <Chip label="Program" variant="filled" className="ml-1"/>
          )}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <>
      <ContentCard
        title={<Typography variant="h3">Account Inputs</Typography>}
        className="mt-6"
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Change (VLX)</TableCell>
                <TableCell align="right">Post Balance (VLX)</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{accountRows}</TableBody>
          </Table>
        </TableContainer>
      </ContentCard>
    </>
  );
}