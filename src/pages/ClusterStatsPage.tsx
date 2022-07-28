import React from "react";
import { Slot } from "components/common/Slot";
import {
  ClusterStatsStatus,
  useDashboardInfo,
  usePerformanceInfo,
  useStatsProvider,
} from "providers/stats/solanaClusterStats";
import { lamportsToSol, slotsToHumanString } from "utils";
import { ClusterStatus, useCluster } from "providers/cluster";
import { TpsCard } from "components/TpsCard";
import { displayTimestampWithoutDate, displayTimestampUtc } from "utils/date";
import { Status, useFetchSupply, useSupply } from "providers/supply";
import { PublicKey } from "@velas/web3";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { useAccountInfo, useFetchAccountInfo } from "providers/accounts";
import { FetchStatus } from "providers/cache";
import { useVoteAccounts } from "providers/accounts/vote-accounts";

import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
// @ts-ignore
import * as CoinGecko from "coingecko-api";

import ContentCard from '../components/common/ContentCard';

enum CoingeckoStatus {
  Success,
  FetchFailed,
}

const CoinGeckoClient = new CoinGecko();

const CLUSTER_STATS_TIMEOUT = 5000;
const STAKE_HISTORY_ACCOUNT = "SysvarStakeHistory1111111111111111111111111";
const PRICE_REFRESH = 10000;

export function ClusterStatsPage() {
  return (
    <div className="mt-6">
      <StakingComponent />
      <ContentCard
        title={
          <Typography variant="h3"> Live Cluster Stats </Typography>
        }
        className="mt-6"
      >
        <StatsCardBody />
      </ContentCard>
      <TpsCard />
    </div>
  );
}

function StakingComponent() {
  const { status } = useCluster();
  const supply = useSupply();
  const fetchSupply = useFetchSupply();
  const fetchAccount = useFetchAccountInfo();
  const stakeInfo = useAccountInfo(STAKE_HISTORY_ACCOUNT);
  const coinInfo = useCoinGecko("velas");
  const { fetchVoteAccounts, voteAccounts } = useVoteAccounts();

  function fetchData() {
    fetchSupply();
    fetchAccount(new PublicKey(STAKE_HISTORY_ACCOUNT));
    fetchVoteAccounts();
  }

  React.useEffect(() => {
    if (status === ClusterStatus.Connected) {
      fetchData();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const deliquentStake = React.useMemo(() => {
    if (voteAccounts) {
      return voteAccounts.delinquent.reduce(
        (prev, current) => prev + current.activatedStake,
        0
      );
    }
  }, [voteAccounts]);

  let stakeHistory = stakeInfo?.data?.details?.data?.parsed.info;

  if (supply === Status.Disconnected) {
    // we'll return here to prevent flicker
    return null;
  }

  if (
    supply === Status.Idle ||
    supply === Status.Connecting ||
    !stakeInfo ||
    !stakeHistory ||
    !coinInfo
  ) {
    return <LoadingCard />;
  } else if (typeof supply === "string") {
    return <ErrorCard text={supply} retry={fetchData} />;
  } else if (
    stakeInfo.status === FetchStatus.FetchFailed ||
    (stakeInfo.status === FetchStatus.Fetched &&
      (!stakeHistory.length || stakeHistory.length < 1))
  ) {
    return (
      <ErrorCard text={"Failed to fetch active stake"} retry={fetchData} />
    );
  }

  stakeHistory = stakeHistory[0].stakeHistory;

  const circulatingPercentage = (
    (supply.circulating / supply.total) *
    100
  ).toFixed(1);

  let delinquentStakePercentage;
  if (deliquentStake) {
    delinquentStakePercentage = (
      (deliquentStake / stakeHistory.effective) *
      100
    ).toFixed(1);
  }

  let solanaInfo;
  if (coinInfo.status === CoingeckoStatus.Success) {
    solanaInfo = coinInfo.coinInfo;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <Paper className="p-4">
        <Typography color="secondary"> Circulating Supply </Typography>
        {/* <span className="ml-2 badge badge-primary rank" style={{opacity: 0.0}}>{displayLamports(supply.circulating)}</span> */}
        <div className="flex flex-row items-end gap-1 py-1">
          <Typography variant="h3"> { `${displayLamports(supply.circulating)} /` } </Typography>
          <Typography color="secondary"> { displayLamports(supply.total) } </Typography>
        </div>
        <Typography color="secondary" variant="body2"> { `${circulatingPercentage}% is circulating` } </Typography>
      </Paper>

      <Paper className="p-4">
        <Typography color="secondary"> Active Staking </Typography>
        {/* <span className="ml-2 badge badge-primary rank" style={{opacity: 0.0}}>{displayLamports(stakeHistory.effective)}</span> */}
        <div className="flex flex-row items-end gap-1 py-1">
          <Typography variant="h3"> {`${displayLamports(stakeHistory.effective)} /`}</Typography>
          <Typography color="secondary"> { displayLamports(supply.total) } </Typography>
        </div>
        {
          delinquentStakePercentage && (
            <Typography color="secondary" variant="body2">
              { `Delinquent stake: ${delinquentStakePercentage}%` }
            </Typography>
          )
        }        
      </Paper>

      <Paper className="p-4">
        {
          solanaInfo && (
            <>
              <div className="flex flex-row gap-4">
                <Typography color="secondary"> Price </Typography>
                <Typography> { `Rank #${solanaInfo.market_cap_rank}` } </Typography>
              </div>
              <div className="flex flex-row gap-4 items-end py-1">
                <Typography variant="h3">{ `$${solanaInfo.price.toFixed(2)}` } </Typography>
                {
                  solanaInfo.price_change_percentage_24h > 0 && (
                    <Typography color="secondary">
                      &uarr; {solanaInfo.price_change_percentage_24h.toFixed(2)}
                      %
                    </Typography>
                  )
                }
                {solanaInfo.price_change_percentage_24h < 0 && (
                  <Typography color="secondary">
                    &darr; {solanaInfo.price_change_percentage_24h.toFixed(2)}
                    %
                  </Typography>
                )}
                {solanaInfo.price_change_percentage_24h === 0 && (
                  <small>0%</small>
                )}
              </div>
              <Typography color="secondary" variant="body2">
                { `24h Vol: $${abbreviatedNumber(solanaInfo.volume_24)}, MCap: $${abbreviatedNumber(solanaInfo.market_cap)}` }
              </Typography>
            </>
          )
        }
        {
          coinInfo.status === CoingeckoStatus.FetchFailed && (
            <>
              <Typography color="secondary"> Price </Typography>
              <Typography variant="h3"> $--.-- </Typography>
              <Typography color="secondary" variant="body2"> Error fetching the latest price information </Typography>
            </>
          )
        }
      </Paper>
    </div>
  );
}

const abbreviatedNumber = (value: number, fixed = 1) => {
  if (value < 1e3) return value;
  if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(fixed) + "K";
  if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(fixed) + "M";
  if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(fixed) + "B";
  if (value >= 1e12) return +(value / 1e12).toFixed(fixed) + "T";
};

function displayLamports(value: number) {
  return abbreviatedNumber(lamportsToSol(value));
}

function StatsCardBody() {
  const dashboardInfo = useDashboardInfo();
  const performanceInfo = usePerformanceInfo();
  const { setActive } = useStatsProvider();
  const { cluster } = useCluster();

  React.useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive, cluster]);

  if (
    performanceInfo.status !== ClusterStatsStatus.Ready ||
    dashboardInfo.status !== ClusterStatsStatus.Ready
  ) {
    const error =
      performanceInfo.status === ClusterStatsStatus.Error ||
      dashboardInfo.status === ClusterStatsStatus.Error;
    return <StatsNotReady error={error} />;
  }

  const {
    avgSlotTime_1h,
    avgSlotTime_1min,
    epochInfo,
    blockTime,
  } = dashboardInfo;
  const hourlySlotTime = Math.round(1000 * avgSlotTime_1h);
  const averageSlotTime = Math.round(1000 * avgSlotTime_1min);
  const { slotIndex, slotsInEpoch } = epochInfo;
  const currentEpoch = epochInfo.epoch.toString();
  const epochProgress = ((100 * slotIndex) / slotsInEpoch).toFixed(1) + "%";
  const epochTimeRemaining = slotsToHumanString(
    slotsInEpoch - slotIndex,
    hourlySlotTime
  );
  const { blockHeight, absoluteSlot } = epochInfo;

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Slot</TableCell>
            <TableCell align="right"><Slot slot={absoluteSlot} link /></TableCell>
          </TableRow>
          {
            blockHeight !== undefined && (
              <TableRow>
                <TableCell>Block Height</TableCell>
                <TableCell align="right"><Slot slot={blockHeight} /></TableCell>
              </TableRow>
            )
          }
          {
            blockTime && (
              <TableRow>
                <TableCell>Cluster Time</TableCell>
                <TableCell align="right"> { displayTimestampUtc(blockTime) } </TableCell>
              </TableRow>
            )
          }
          <TableRow>
            <TableCell>Slot time (1min average)</TableCell>
            <TableCell align="right"> {`${averageSlotTime} ms`} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Slot time (1hr average)</TableCell>
            <TableCell align="right"> {`${hourlySlotTime} ms`} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Epoch</TableCell>
            <TableCell align="right"> { currentEpoch } </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Epoch progress</TableCell>
            <TableCell align="right"> { epochProgress } </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Epoch time remaining (approx.)</TableCell>
            <TableCell align="right"> { `~${epochTimeRemaining}` } </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function StatsNotReady({ error }: { error: boolean }) {
  const { setTimedOut, retry, active } = useStatsProvider();
  const { cluster } = useCluster();

  React.useEffect(() => {
    let timedOut = 0;
    if (!error) {
      timedOut = setTimeout(setTimedOut, CLUSTER_STATS_TIMEOUT);
    }
    return () => {
      if (timedOut) {
        clearTimeout(timedOut);
      }
    };
  }, [setTimedOut, cluster, error]);

  if (error || !active) {
    return (
      <div className="card-body text-center">
        There was a problem loading cluster stats.{" "}
        <button
          className="btn btn-white btn-sm"
          onClick={() => {
            retry();
          }}
        >
          <span className="fe fe-refresh-cw mr-2"></span>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-body text-center">
      <span className="spinner-grow spinner-grow-sm mr-2"></span>
      Loading
    </div>
  );
}

interface CoinInfo {
  price: number;
  volume_24: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  last_updated: Date;
}

interface CoinInfoResult {
  data: {
    market_data: {
      current_price: {
        usd: number;
      };
      total_volume: {
        usd: number;
      };
      market_cap: {
        usd: number;
      };
      price_change_percentage_24h: number;
      market_cap_rank: number;
    };
    last_updated: string;
  };
}

type CoinGeckoResult = {
  coinInfo?: CoinInfo;
  status: CoingeckoStatus;
};

function useCoinGecko(coinId: string): CoinGeckoResult | undefined {
  const [coinInfo, setCoinInfo] = React.useState<CoinGeckoResult>();

  React.useEffect(() => {
    const getCoinInfo = () => {
      CoinGeckoClient.coins
        .fetch("velas")
        .then((info: CoinInfoResult) => {
          setCoinInfo({
            coinInfo: {
              price: info.data.market_data.current_price.usd,
              volume_24: info.data.market_data.total_volume.usd,
              market_cap: info.data.market_data.market_cap.usd,
              market_cap_rank: info.data.market_data.market_cap_rank,
              price_change_percentage_24h:
                info.data.market_data.price_change_percentage_24h,
              last_updated: new Date(info.data.last_updated),
            },
            status: CoingeckoStatus.Success,
          });
        })
        .catch((error: any) => {
          setCoinInfo({
            status: CoingeckoStatus.FetchFailed,
          });
        });
    };

    getCoinInfo();
    const interval = setInterval(() => {
      getCoinInfo();
    }, PRICE_REFRESH);

    return () => {
      clearInterval(interval);
    };
  }, [setCoinInfo]);

  return coinInfo;
}