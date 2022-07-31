import React from "react";
import { useBlock, useFetchBlock, FetchStatus } from "providers/block";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { Slot } from "components/common/Slot";
import { ClusterStatus, useCluster } from "providers/cluster";
import { BlockHistoryCard } from "./BlockHistoryCard";
import { BlockRewardsCard } from "./BlockRewardsCard";
import { BlockResponse } from "@velas/web3";
import { BlockProgramsCard } from "./BlockProgramsCard";
import { BlockAccountsCard } from "./BlockAccountsCard";
import ContentCard from "components/common/ContentCard";
import { Typography, TableContainer, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { Tabs, Tab as MuiTab } from "@mui/material";
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
    return <LoadingCard message="Loading block" />;
  } else if (
    confirmedBlock.data === undefined ||
    confirmedBlock.status === FetchStatus.FetchFailed
  ) {
    return <ErrorCard retry={refresh} text="Failed to fetch block" />;
  } else if (confirmedBlock.data.block === undefined) {
    return <ErrorCard retry={refresh} text={`Block ${slot} was not found`}  />;
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
                  <span className="font-mono">{block.blockhash}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parent Slot</TableCell>
                <TableCell align="right">
                  <Slot slot={block.parentSlot} link align="end"/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parent Blockhash</TableCell>
                <TableCell align="right">
                  <span className="font-mono">{block.previousBlockhash}</span>
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
  const [value, setValue] = React.useState(0);

  interface TabPanelProps {
    children?: React.ReactNode;
    tab: string;
    index: number;
  }

  const TabPanel = (props: TabPanelProps) => {
    switch (props.tab) {
      case "history":
        return (
          <div hidden={props.index !== value}>
            <BlockHistoryCard block={block} />
          </div>
        );
      case "rewards":
        return (
          <div hidden={props.index !== value}>
            <BlockRewardsCard block={block} />
          </div>
        );
      case "accounts":
        return (
          <div hidden={props.index !== value}>
            <BlockAccountsCard block={block} />
          </div>
        );
      case "programs":
        return (
          <div hidden={props.index !== value}>
            <BlockProgramsCard block={block} />
          </div>
        );
      default:
        return null;
    };
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} className="my-6 border-b border-grey-light" onChange={handleTabChange}>
        {TABS.map(({ title, slug, path }) => (
          <MuiTab key={slug} disableRipple label={title} />
        ))}
      </Tabs>
      {TABS.map(({ slug }, index) => 
        <TabPanel key={index} tab={slug} index={index}/>
      )}
    </>
  );
}
