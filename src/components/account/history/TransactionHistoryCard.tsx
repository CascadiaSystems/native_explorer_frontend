import React from "react";
import { Signature } from "components/common/Signature";
import { Slot } from "components/common/Slot";
import Moment from "react-moment";
import { PublicKey } from "@velas/web3";
import {
  useAccountHistory,
  useFetchAccountHistory,
} from "providers/accounts/history";
import {
  getTransactionRows,
  HistoryCardFooter,
} from "../HistoryCardComponents";
import { FetchStatus } from "providers/cache";
import { LoadingCard } from "components/common/LoadingCard";
import { ErrorCard } from "components/common/ErrorCard";
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody, Button, Typography } from "@mui/material";
import { LoadingButton }  from '@mui/lab';
import ContentCard from "components/common/ContentCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

export function TransactionHistoryCard({ pubkey }: { pubkey: PublicKey }) {
  const address = pubkey.toBase58();
  const history = useAccountHistory(address);
  const fetchAccountHistory = useFetchAccountHistory();
  const refresh = () => fetchAccountHistory(pubkey, false, true);
  const loadMore = () => fetchAccountHistory(pubkey, false);

  const transactionRows = React.useMemo(() => {
    if (history?.data?.fetched) {
      return getTransactionRows(history.data.fetched);
    }
    return [];
  }, [history]);

  React.useEffect(() => {
    if (!history) {
      refresh();
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!history) {
    return null;
  }

  if (history?.data === undefined) {
    if (history.status === FetchStatus.Fetching) {
      return <LoadingCard message="Loading history" />;
    }

    return (
      <ErrorCard retry={refresh} text="Failed to fetch transaction history" />
    );
  }

  const hasTimestamps = transactionRows.some((element) => element.blockTime);
  const detailsList: React.ReactNode[] = transactionRows.map(
    ({ slot, signature, blockTime, statusClass, statusText }) => {
      return (
        <TableRow key={signature}>
          <TableCell>
            <Signature signature={signature} link truncate />
          </TableCell>

          <TableCell>
            <Slot slot={slot} link />
          </TableCell>

          {
            hasTimestamps && (
              <TableCell align="right">
                {blockTime ? <Moment date={blockTime * 1000} fromNow /> : "---"}
              </TableCell>
          )}

          <TableCell align="right">
            { statusText }
            {/* <span className={`badge badge-soft-${statusClass}`}>
              {statusText}
            </span> */}
          </TableCell>
        </TableRow>
      );
    }
  );

  
  const fetching = history.status === FetchStatus.Fetching;

  const ActionButton = () => {
    return fetching ? (
      <LoadingButton
        variant="outlined"
        color="primary"
        size="small"
        loading={fetching}
        loadingPosition="start"
      >
        <div className="pl-6">
          Loading...
        </div>
      </LoadingButton>
    ) : (
      <Button variant="outlined"
        size="small"
        disableRipple
        startIcon={<FontAwesomeIcon icon={faRotate} />}
        onClick={() => refresh()}
      >
        Refresh
      </Button>
    );
  } 

  return (
    <ContentCard
      title={(
        <Typography variant="h4">
          Transaction History
        </Typography>
      )}
      action={<ActionButton />}
      footer={<HistoryCardFooter
        fetching={fetching}
        foundOldest={history.data.foundOldest}
        loadMore={() => loadMore()}
      />}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Transaction Signature </TableCell>
              <TableCell> Slot </TableCell>
              { hasTimestamps && <TableCell align="right"> Age </TableCell> }
              <TableCell align="right"> Result </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { detailsList }
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
