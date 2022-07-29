import React from "react";
import { TableCardBody } from "components/common/TableCardBody";
import { useBlock, useFetchBlock, FetchStatus } from "providers/block";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { Slot } from "components/common/Slot";
import { ClusterStatus, useCluster } from "providers/cluster";
import { BlockHistoryCard } from "./BlockHistoryCard";
import { BlockRewardsCard } from "./BlockRewardsCard";
import { BlockResponse } from "@velas/web3";
import { NavLink } from "react-router-dom";
import { clusterPath } from "utils/url";
import { BlockProgramsCard } from "./BlockProgramsCard";
import { BlockAccountsCard } from "./BlockAccountsCard";
import ContentCard from "components/common/ContentCard";
import { Typography, TableContainer, Table, TableBody, TableRow, TableCell } from "@mui/material";

export function BlockOverviewCard({
  slot,
  tab,
}: {
  slot: number;
  tab?: string;
}) {
  const confirmedBlock = useBlock(slot);
  const fetchBlock = useFetchBlock();
  const { status } = useCluster();
  const refresh = () => fetchBlock(slot);

  // Fetch block on load
  React.useEffect(() => {
    if (!confirmedBlock && status === ClusterStatus.Connected) refresh();
  }, [slot, status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!confirmedBlock || confirmedBlock.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading block" className="mt-6"/>;
  } else if (
    confirmedBlock.data === undefined ||
    confirmedBlock.status === FetchStatus.FetchFailed
  ) {
    return <ErrorCard retry={refresh} text="Failed to fetch block" className="mt-6" />;
  } else if (confirmedBlock.data.block === undefined) {
    return <ErrorCard retry={refresh} text={`Block ${slot} was not found`} className="mt-6" />;
  }

  const block = confirmedBlock.data.block;
  const committedTxs = block.transactions.filter((tx) => tx.meta?.err === null);

  return (
    <>
      <ContentCard
        title={<Typography variant="h3">Overview</Typography>}
      >
        <TableContainer>
          <Table>
            <TableBody>

              <TableRow>
                <TableCell>Slot</TableCell>
                <TableCell align="right">
                  <Slot slot={slot} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Blockhash</TableCell>
                <TableCell align="right">
                  <span>{block.blockhash}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parent Slot</TableCell>
                <TableCell align="right">
                  <Slot slot={block.parentSlot} link />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parent Blockhash</TableCell>
                <TableCell align="right">
                  <span>{block.previousBlockhash}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Processed Transactions</TableCell>
                <TableCell align="right">
                  <span>{block.transactions.length}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Successful Transactions</TableCell>
                <TableCell align="right">
                  <span>{committedTxs.length}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ContentCard>
      <MoreSection block={block} slot={slot} tab={tab} />
    </>
  );
}

const TABS: Tab[] = [
  {
    slug: "history",
    title: "Transactions",
    path: "",
  },
  {
    slug: "rewards",
    title: "Rewards",
    path: "/rewards",
  },
  {
    slug: "programs",
    title: "Programs",
    path: "/programs",
  },
  {
    slug: "accounts",
    title: "Accounts",
    path: "/accounts",
  },
];

type MoreTabs = "history" | "rewards" | "programs" | "accounts";

type Tab = {
  slug: MoreTabs;
  title: string;
  path: string;
};

function MoreSection({
  slot,
  block,
  tab,
}: {
  slot: number;
  block: BlockResponse;
  tab?: string;
}) {
  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header-body pt-0">
            <ul className="nav nav-tabs nav-overflow header-tabs">
              {TABS.map(({ title, slug, path }) => (
                <li key={slug} className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={clusterPath(`/block/${slot}${path}`)}
                    exact
                  >
                    {title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {tab === undefined && <BlockHistoryCard block={block} />}
      {tab === "rewards" && <BlockRewardsCard block={block} />}
      {tab === "accounts" && <BlockAccountsCard block={block} />}
      {tab === "programs" && <BlockProgramsCard block={block} />}
    </>
  );
}
