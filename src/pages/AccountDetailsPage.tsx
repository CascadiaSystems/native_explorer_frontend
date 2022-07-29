import React from "react";
import { PublicKey } from "@velas/web3";
import { CacheEntry, FetchStatus } from "providers/cache";
import {
  useFetchAccountInfo,
  useAccountInfo,
  Account,
  ProgramData,
} from "providers/accounts";
import { StakeAccountSection } from "components/account/StakeAccountSection";
import { TokenAccountSection } from "components/account/TokenAccountSection";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { useCluster, ClusterStatus } from "providers/cluster";
import { UnknownAccountCard } from "components/account/UnknownAccountCard";
import { OwnedTokensCard } from "components/account/OwnedTokensCard";
import { TokenHistoryCard } from "components/account/TokenHistoryCard";
import { TokenLargestAccountsCard } from "components/account/TokenLargestAccountsCard";
import { VoteAccountSection } from "components/account/VoteAccountSection";
import { NonceAccountSection } from "components/account/NonceAccountSection";
import { VotesCard } from "components/account/VotesCard";
import { SysvarAccountSection } from "components/account/SysvarAccountSection";
import { SlotHashesCard } from "components/account/SlotHashesCard";
import { StakeHistoryCard } from "components/account/StakeHistoryCard";
import { BlockhashesCard } from "components/account/BlockhashesCard";
import { ConfigAccountSection } from "components/account/ConfigAccountSection";
import { useFlaggedAccounts } from "providers/accounts/flagged-accounts";
import { UpgradeableLoaderAccountSection } from "components/account/UpgradeableLoaderAccountSection";
import { useTokenRegistry } from "providers/mints/token-registry";
import { Identicon } from "components/common/Identicon";
import { TransactionHistoryCard } from "components/account/history/TransactionHistoryCard";
import { TokenTransfersCard } from "components/account/history/TokenTransfersCard";
import { TokenInstructionsCard } from "components/account/history/TokenInstructionsCard";
import { RewardsCard } from "components/account/RewardsCard";
import { Tabs, Tab as MuiTab, Typography } from "@mui/material";

const IDENTICON_WIDTH = 64;

const TABS_LOOKUP: { [id: string]: Tab[] } = {
  "spl-token:mint": [
    {
      slug: "transfers",
      title: "Transfers"
    },
    {
      slug: "instructions",
      title: "Instructions",
    },
    {
      slug: "largest",
      title: "Distribution",
    },
  ],
  stake: [
    {
      slug: "rewards",
      title: "Rewards",
    },
  ],
  vote: [
    {
      slug: "vote-history",
      title: "Vote History",
    },
    {
      slug: "rewards",
      title: "Rewards",
    },
  ],
  "sysvar:recentBlockhashes": [
    {
      slug: "blockhashes",
      title: "Blockhashes",
    },
  ],
  "sysvar:slotHashes": [
    {
      slug: "slot-hashes",
      title: "Slot Hashes",
    },
  ],
  "sysvar:stakeHistory": [
    {
      slug: "stake-history",
      title: "Stake History",
    },
  ],
};

const TOKEN_TABS_HIDDEN = [
  "spl-token:mint",
  "config",
  "vote",
  "sysvar",
  "config",
];

type Props = { address: string; tab?: string };
export function AccountDetailsPage({ address, tab }: Props) {
  const fetchAccount = useFetchAccountInfo();
  const { status } = useCluster();
  const info = useAccountInfo(address);
  let pubkey: PublicKey | undefined;

  try {
    pubkey = new PublicKey(address);
  } catch (err) {}

  // Fetch account on load
  React.useEffect(() => {
    if (!info && status === ClusterStatus.Connected && pubkey) {
      fetchAccount(pubkey);
    }
  }, [address, status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="header">
        <div className="header-body">
          <AccountHeader address={address} info={info} />
        </div>
      </div>
      {!pubkey ? (
        <ErrorCard text={`Address "${address}" is not valid`} />
      ) : (
        <DetailsSections pubkey={pubkey} info={info} />
      )}
    </div>
  );
}

export function AccountHeader({
  address,
  info,
}: {
  address: string;
  info?: CacheEntry<Account>;
}) {
  const { tokenRegistry } = useTokenRegistry();
  const tokenDetails = tokenRegistry.get(address);
  const account = info?.data;
  const data = account?.details?.data;
  const isToken = data?.program === "spl-token" && data?.parsed.type === "mint";

  if (tokenDetails || isToken) {
    return (
      <div className="row align-items-end">
        <div className="col-auto">
          <div className="avatar avatar-lg header-avatar-top">
            {tokenDetails?.logoURI ? (
              <img
                src={tokenDetails.logoURI}
                alt="token logo"
                className="avatar-img rounded-circle border border-4 border-body"
              />
            ) : (
              <Identicon
                address={address}
                className="avatar-img rounded-circle border border-body identicon-wrapper"
                style={{ width: IDENTICON_WIDTH }}
              />
            )}
          </div>
        </div>

        <div className="col mb-3 ml-n3 ml-md-n2">
          <h6 className="header-pretitle">Token</h6>
          <h2 className="header-title">
            {tokenDetails?.name || "Unknown Token"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <Typography variant="h2" className="py-6">
      Account
    </Typography>
  );
}

function DetailsSections({
  pubkey,
  info,
}: {
  pubkey: PublicKey;
  info?: CacheEntry<Account>;
}) {
  const fetchAccount = useFetchAccountInfo();
  const address = pubkey.toBase58();
  const { flaggedAccounts } = useFlaggedAccounts();

  if (!info || info.status === FetchStatus.Fetching) {
    return <LoadingCard />;
  } else if (
    info.status === FetchStatus.FetchFailed ||
    info.data?.lamports === undefined
  ) {
    return <ErrorCard retry={() => fetchAccount(pubkey)} text="Fetch Failed" />;
  }

  const account = info.data;
  const data = account?.details?.data;
  const tabs = getTabs(data);

  return (
    <>
      {flaggedAccounts.has(address) && (
        <div className="alert alert-danger alert-scam" role="alert">
          Warning! This account has been flagged by the community as a scam
          account. Please be cautious sending assets to this account.
        </div>
      )}
      {<InfoSection account={account} />}
      {<MoreSection account={account} tabs={tabs} />}
    </>
  );
}

function InfoSection({ account }: { account: Account }) {
  const data = account?.details?.data;

  if (data && data.program === "bpf-upgradeable-loader") {
    return (
      <UpgradeableLoaderAccountSection
        account={account}
        parsedData={data.parsed}
        programData={data.programData}
      />
    );
  } else if (data && data.program === "stake") {
    return (
      <StakeAccountSection
        account={account}
        stakeAccount={data.parsed.info}
        activation={data.activation}
        stakeAccountType={data.parsed.type}
      />
    );
  } else if (data && data.program === "spl-token") {
    return <TokenAccountSection account={account} tokenAccount={data.parsed} />;
  } else if (data && data.program === "nonce") {
    return <NonceAccountSection account={account} nonceAccount={data.parsed} />;
  } else if (data && data.program === "vote") {
    return <VoteAccountSection account={account} voteAccount={data.parsed} />;
  } else if (data && data.program === "sysvar") {
    return (
      <SysvarAccountSection account={account} sysvarAccount={data.parsed} />
    );
  } else if (data && data.program === "config") {
    return (
      <ConfigAccountSection account={account} configAccount={data.parsed} />
    );
  } else {
    return <UnknownAccountCard account={account} />;
  }
}

type Tab = {
  slug: MoreTabs;
  title: string;
  // path: string;
};

export type MoreTabs =
  | "history"
  | "tokens"
  | "largest"
  | "vote-history"
  | "slot-hashes"
  | "stake-history"
  | "blockhashes"
  | "transfers"
  | "instructions"
  | "rewards";

function MoreSection({
  account,
  tabs,
}: {
  account: Account;
  tabs: Tab[];
}) {
  const [value, setValue] = React.useState(0);

  const pubkey = account.pubkey;
  // const address = account.pubkey.toBase58();
  const data = account?.details?.data;


  interface TabPanelProps {
    children?: React.ReactNode;
    tab: string;
    index: number;
  }

  const TabPanel = (props: TabPanelProps) => {
    switch (props.tab) {
      case "tokens":
        return (
          <div hidden={props.index !== value}>
            <OwnedTokensCard pubkey={pubkey} />
            <TokenHistoryCard pubkey={pubkey} />
          </div>
        );
      case "history":
        return (
          <div hidden={props.index !== value}>
            <TransactionHistoryCard pubkey={pubkey} />
          </div>
        );
      case "transfers":
        return (
          <div hidden={props.index !== value}>
            <TokenTransfersCard pubkey={pubkey} />
          </div>
        );        
      case "instructions":
        return (
          <div hidden={props.index !== value}>
            <TokenInstructionsCard pubkey={pubkey} />
          </div>
        );
      case "largest":
        return (
          <div hidden={props.index !== value}>
            <TokenLargestAccountsCard pubkey={pubkey} />
          </div>
        );
      case "rewards":
        return (
          <div hidden={props.index !== value}>
            <RewardsCard pubkey={pubkey} />
          </div>
        );
      case "vote-history":
        return data?.program === "vote" ? (
          <div hidden={props.index !== value}>
            <VotesCard voteAccount={data.parsed} />
          </div>
        ) : null;
      case "slot-hashes":
        return data?.program === "sysvar" &&
          data.parsed.type === "slotHashes" ? (
            <div hidden={props.index !== value}>
              <SlotHashesCard sysvarAccount={data.parsed} />
            </div>
          ) : null;
      case "stake-history":
        return data?.program === "sysvar" &&
          data.parsed.type === "stakeHistory" ? (
            <div hidden={props.index !== value}>
              <StakeHistoryCard sysvarAccount={data.parsed} />
            </div>
          ) : null;
      case "blockhashed":
        return data?.program === "sysvar" &&
          data.parsed.type === "recentBlockhashes" ? (
            <div hidden={props.index !== value}>
              <BlockhashesCard blockhashes={data.parsed.info} />
            </div>
          ) : null;
      default:
        return null;
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} className="my-6" onChange={handleTabChange}>
        {tabs.map(({ title, slug }) => 
          <MuiTab key={slug} disableRipple label={title} />
        )}
      </Tabs>
      {tabs.map(({ slug }, index) => 
        <TabPanel key={index} tab={slug} index={index}/>
      )}      
    </>
  );
}

function getTabs(data?: ProgramData): Tab[] {
  const tabs: Tab[] = [
    {
      slug: "history",
      title: "History",
      // path: "",
    },
  ];

  let programTypeKey = "";
  if (data && "parsed" in data && "type" in data.parsed) {
    programTypeKey = `${data.program}:${data.parsed.type}`;
  }

  if (data && data.program in TABS_LOOKUP) {
    tabs.push(...TABS_LOOKUP[data.program]);
  }

  if (data && programTypeKey in TABS_LOOKUP) {
    tabs.push(...TABS_LOOKUP[programTypeKey]);
  }

  if (
    !data ||
    !(
      TOKEN_TABS_HIDDEN.includes(data.program) ||
      TOKEN_TABS_HIDDEN.includes(programTypeKey)
    )
  ) {
    tabs.push({
      slug: "tokens",
      title: "Tokens",
      // path: "/tokens",
    });
  }

  return tabs;
}
