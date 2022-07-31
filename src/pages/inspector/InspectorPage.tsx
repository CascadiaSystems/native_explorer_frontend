import React from "react";
import { Message, PACKET_DATA_SIZE } from "@velas/web3";

import { TableCardBody } from "components/common/TableCardBody";
import { SolBalance } from "utils";
import { useQuery } from "utils/url";
import { useHistory, useLocation } from "react-router";
import {
  useFetchRawTransaction,
  useRawTransactionDetails,
} from "providers/transactions/raw";
import { FetchStatus } from "providers/cache";
import { LoadingCard } from "components/common/LoadingCard";
import { ErrorCard } from "components/common/ErrorCard";
import { TransactionSignatures } from "./SignaturesCard";
import { AccountsCard } from "./AccountsCard";
import {
  AddressWithContext,
  createFeePayerValidator,
} from "./AddressWithContext";
import { SimulatorCard } from "./SimulatorCard";
import { MIN_MESSAGE_LENGTH, RawInput } from "./RawInputCard";
import { InstructionsSection } from "./InstructionsSection";
import base58 from "bs58";
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import ContentCard from "components/common/ContentCard";

export type TransactionData = {
  rawMessage: Uint8Array;
  message: Message;
  signatures?: (string | null)[];
};

// Decode a url param and return the result. If decoding fails, return whether
// the param should be deleted.
function decodeParam(params: URLSearchParams, name: string): string | boolean {
  const param = params.get(name);
  if (param === null) return false;
  try {
    return decodeURIComponent(param);
  } catch (err) {
    return true;
  }
}

// Decode a signatures param and throw an error on failure
function decodeSignatures(signaturesParam: string): (string | null)[] {
  let signatures;
  try {
    signatures = JSON.parse(signaturesParam);
  } catch (err) {
    throw new Error("Signatures param is not valid JSON");
  }

  if (!Array.isArray(signatures)) {
    throw new Error("Signatures param is not a JSON array");
  }

  const validSignatures: (string | null)[] = [];
  for (const signature of signatures) {
    if (signature === null) {
      validSignatures.push(signature);
      continue;
    }

    if (typeof signature !== "string") {
      throw new Error("Signature is not a string");
    }

    try {
      base58.decode(signature);
      validSignatures.push(signature);
    } catch (err) {
      throw new Error("Signature is not valid base58");
    }
  }

  return validSignatures;
}

// Decodes url params into transaction data if possible. If decoding fails,
// URL params are returned as a string that will prefill the transaction
// message input field for debugging. Returns a tuple of [result, shouldRefreshUrl]
function decodeUrlParams(
  params: URLSearchParams
): [TransactionData | string, boolean] {
  const messageParam = decodeParam(params, "message");
  const signaturesParam = decodeParam(params, "signatures");

  let refreshUrl = false;
  if (signaturesParam === true) {
    params.delete("signatures");
    refreshUrl = true;
  }

  if (typeof messageParam === "boolean") {
    if (messageParam) {
      params.delete("message");
      params.delete("signatures");
      refreshUrl = true;
    }
    return ["", refreshUrl];
  }

  let signatures: (string | null)[] | undefined = undefined;
  if (typeof signaturesParam === "string") {
    try {
      signatures = decodeSignatures(signaturesParam);
    } catch (err) {
      params.delete("signatures");
      refreshUrl = true;
    }
  }

  try {
    const buffer = Uint8Array.from(atob(messageParam), (c) => c.charCodeAt(0));

    if (buffer.length < MIN_MESSAGE_LENGTH) {
      throw new Error("message buffer is too short");
    }

    const message = Message.from(buffer);
    const data = {
      message,
      rawMessage: buffer,
      signatures,
    };
    return [data, refreshUrl];
  } catch (err) {
    params.delete("message");
    refreshUrl = true;
    return [messageParam, true];
  }
}

export function TransactionInspectorPage({
  signature,
}: {
  signature?: string;
}) {
  const [transaction, setTransaction] = React.useState<TransactionData>();
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();
  const [paramString, setParamString] = React.useState<string>();

  // Sync message with url search params
  React.useEffect(() => {
    if (signature) return;
    if (transaction) {
      let shouldRefreshUrl = false;

      if (transaction.signatures !== undefined) {
        const signaturesParam = encodeURIComponent(
          JSON.stringify(transaction.signatures)
        );
        if (query.get("signatures") !== signaturesParam) {
          shouldRefreshUrl = true;
          query.set("signatures", signaturesParam);
        }
      }

      const base64 = btoa(
        String.fromCharCode.apply(null, [...transaction.rawMessage])
      );
      const newParam = encodeURIComponent(base64);
      if (query.get("message") !== newParam) {
        shouldRefreshUrl = true;
        query.set("message", newParam);
      }

      if (shouldRefreshUrl) {
        history.push({ ...location, search: query.toString() });
      }
    }
  }, [query, transaction, signature, history, location]);

  const reset = React.useCallback(() => {
    query.delete("message");
    history.push({ ...location, search: query.toString() });
    setTransaction(undefined);
  }, [query, location, history]);

  // Decode the message url param whenever it changes
  React.useEffect(() => {
    if (transaction || signature) return;

    const [result, refreshUrl] = decodeUrlParams(query);
    if (refreshUrl) {
      history.push({ ...location, search: query.toString() });
    }

    if (typeof result === "string") {
      setParamString(result);
    } else {
      setTransaction(result);
    }
  }, [query, transaction, signature, history, location]);

  return (
    <>
      <Typography variant="h2" className="py-6">
        Transaction Inspector
      </Typography>
      {signature ? (
        <PermalinkView signature={signature} reset={reset} />
      ) : transaction ? (
        <LoadedView transaction={transaction} onClear={reset} />
      ) : (
        <RawInput value={paramString} setTransactionData={setTransaction} />
      )}
    </>
  );
}

function PermalinkView({
  signature,
}: {
  signature: string;
  reset: () => void;
}) {
  const details = useRawTransactionDetails(signature);
  const fetchTransaction = useFetchRawTransaction();
  const refreshTransaction = () => fetchTransaction(signature);
  const history = useHistory();
  const location = useLocation();
  const transaction = details?.data?.raw;
  const reset = React.useCallback(() => {
    history.push({ ...location, pathname: "/tx/inspector" });
  }, [history, location]);

  // Fetch details on load
  React.useEffect(() => {
    if (!details) fetchTransaction(signature);
  }, [signature, details, fetchTransaction]);

  if (!details || details.status === FetchStatus.Fetching) {
    return <LoadingCard />;
  } else if (details.status === FetchStatus.FetchFailed) {
    return (
      <ErrorCard
        retry={refreshTransaction}
        text="Failed to fetch transaction"
      />
    );
  } else if (!transaction) {
    return (
      <ErrorCard
        text="Transaction was not found"
        retry={reset}
        retryText="Reset"
      />
    );
  }

  const { message, signatures } = transaction;
  const tx = { message, rawMessage: message.serialize(), signatures };

  return <LoadedView transaction={tx} onClear={reset} />;
}

function LoadedView({
  transaction,
  onClear,
}: {
  transaction: TransactionData;
  onClear: () => void;
}) {
  const { message, rawMessage, signatures } = transaction;

  return (
    <>
      <OverviewCard message={message} raw={rawMessage} onClear={onClear} />
      <SimulatorCard message={message} className="mt-6"/>
      {signatures && (
        <TransactionSignatures
          message={message}
          signatures={signatures}
          rawMessage={rawMessage}
          className="mt-6"
        />
      )}
      <AccountsCard message={message} className="mt-6"/>
      <InstructionsSection message={message} />
    </>
  );
}

const DEFAULT_FEES = {
  lamportsPerSignature: 5000,
};

function OverviewCard({
  message,
  raw,
  onClear,
}: {
  message: Message;
  raw: Uint8Array;
  onClear: () => void;
}) {
  const fee =
    message.header.numRequiredSignatures * DEFAULT_FEES.lamportsPerSignature;
  const feePayerValidator = createFeePayerValidator(fee);

  const size = React.useMemo(() => {
    const sigBytes = 1 + 64 * message.header.numRequiredSignatures;
    return sigBytes + raw.length;
  }, [message, raw]);

  return (
    <>
      <ContentCard
        title={<Typography variant="h3">Transaction Overview</Typography>}
        action={(
          <Button variant="outlined" size="small" onClick={onClear}>
            Clear
          </Button>
        )}
      >
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Serialized Size</TableCell>
                <TableCell align="right">
                  <div className="flex items-end flex-col gap-2">
                    {size} bytes
                    <span
                      className={
                        size <= PACKET_DATA_SIZE ? "text-muted" : "text-warning"
                      }
                    >
                      Max transaction size is {PACKET_DATA_SIZE} bytes
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fees</TableCell>
                <TableCell align="right">
                  <div className="flex items-end flex-col gap-2">
                    <SolBalance lamports={fee} />
                    <span className="text-muted">
                      {`Each signature costs ${DEFAULT_FEES.lamportsPerSignature} lamports`}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-start flex-col gap-2">
                    Fee payer
                    <div className="flex items-center gap-2">
                      <Chip label="Signer" size="small"/>
                      <Chip label="Writable" size="small"/>
                      {/* <span className="badge badge-soft-info mr-2">Signer</span>
                      <span className="badge badge-soft-danger mr-2">Writable</span> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {message.accountKeys.length === 0 ? (
                    "No Fee Payer"
                  ) : (
                    <AddressWithContext
                      pubkey={message.accountKeys[0]}
                      validator={feePayerValidator}
                    />
                  )}
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

      </ContentCard>
      <div className="card">
      </div>
    </>
  );
}
