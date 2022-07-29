import React from "react";
import { PublicKey } from "@velas/web3";
import { useFetchRewards, useRewards } from "providers/accounts/rewards";
import { LoadingCard } from "components/common/LoadingCard";
import { FetchStatus } from "providers/cache";
import { ErrorCard } from "components/common/ErrorCard";
import { Slot } from "components/common/Slot";
import { lamportsToSolString } from "utils";
import { useAccountInfo } from "providers/accounts";
import BN from "bn.js";
import ContentCard from "components/common/ContentCard";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1));

export function RewardsCard({ pubkey }: { pubkey: PublicKey }) {
  const address = React.useMemo(() => pubkey.toBase58(), [pubkey]);
  const info = useAccountInfo(address);
  const account = info?.data;
  const data = account?.details?.data?.parsed.info;

  const highestEpoch = React.useMemo(() => {
    if (data.stake && !data.stake.delegation.deactivationEpoch.eq(MAX_EPOCH)) {
      return data.stake.delegation.deactivationEpoch.toNumber();
    }
  }, [data]);

  const rewards = useRewards(address);
  const fetchRewards = useFetchRewards();
  const loadMore = () => fetchRewards(pubkey, highestEpoch);

  React.useEffect(() => {
    if (!rewards) {
      fetchRewards(pubkey, highestEpoch);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!rewards) {
    return null;
  }

  if (rewards?.data === undefined) {
    if (rewards.status === FetchStatus.Fetching) {
      return <LoadingCard message="Loading rewards" />;
    }

    return <ErrorCard retry={loadMore} text="Failed to fetch rewards" />;
  }

  const rewardsList = rewards.data.rewards.map((reward) => {
    if (!reward) {
      return null;
    }

    return (
      <TableRow key={reward.epoch}>
        <TableCell>{reward.epoch}</TableCell>
        <TableCell>
          <Slot slot={reward.effectiveSlot} link />
        </TableCell>
        <TableCell align="right">{lamportsToSolString(reward.amount)}</TableCell>
        <TableCell align="right">{lamportsToSolString(reward.postBalance)}</TableCell>
      </TableRow>
    );
  });
  const rewardsFound = rewardsList.some((r) => r);
  const { foundOldest, lowestFetchedEpoch, highestFetchedEpoch } = rewards.data;
  const fetching = rewards.status === FetchStatus.Fetching;

  return rewardsFound ? (
    <ContentCard
      title={<Typography variant="h3">Rewards</Typography>}
      footer={foundOldest ? (
        <div className="w-full text-center">Fetched full history</div>
      ) : (
        <LoadingButton
          disableRipple
          variant="contained"
          className="w-full"
          loading={fetching}
          onClick={() => loadMore()}
        >
          Load More
        </LoadingButton>
      )}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Epoch</TableCell>
              <TableCell>Effective Slot</TableCell>
              <TableCell align="right">Reward Amount</TableCell>
              <TableCell align="right">Post Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { rewardsList }
          </TableBody>
        </Table>
      </TableContainer>

    </ContentCard>
  ) : (
    <div className="p-4">
      {`No rewards issued between epochs ${lowestFetchedEpoch} and ${highestFetchedEpoch}`}
    </div>
  );
}
