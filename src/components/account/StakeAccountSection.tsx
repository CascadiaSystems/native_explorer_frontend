import React from "react";
import { TableCardBody } from "components/common/TableCardBody";
import { SolBalance } from "utils";
import { displayTimestampUtc } from "utils/date";
import { Account, useFetchAccountInfo } from "providers/accounts";
import { Address } from "components/common/Address";
import {
  StakeAccountInfo,
  StakeMeta,
  StakeAccountType,
} from "validators/accounts/stake";
import BN from "bn.js";
import { StakeActivationData } from "@velas/web3";
import ContentCard from "components/common/ContentCard";
import { Button, Typography, TableContainer, Table, TableRow, TableCell, TableBody } from "@mui/material";

const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1));

export function StakeAccountSection({
  account,
  stakeAccount,
  activation,
  stakeAccountType,
}: {
  account: Account;
  stakeAccount: StakeAccountInfo;
  stakeAccountType: StakeAccountType;
  activation?: StakeActivationData;
}) {
  const hideDelegation =
    stakeAccountType !== "delegated" ||
    isFullyInactivated(stakeAccount, activation);
  return (
    <>
      <LockupCard stakeAccount={stakeAccount} />
      <OverviewCard
        account={account}
        stakeAccount={stakeAccount}
        stakeAccountType={stakeAccountType}
        activation={activation}
        hideDelegation={hideDelegation}
      />
      {!hideDelegation && (
        <DelegationCard
          stakeAccount={stakeAccount}
          activation={activation}
          stakeAccountType={stakeAccountType}
        />
      )}
      <AuthoritiesCard meta={stakeAccount.meta} />
    </>
  );
}

function LockupCard({ stakeAccount }: { stakeAccount: StakeAccountInfo }) {
  const unixTimestamp = 1000 * (stakeAccount.meta?.lockup.unixTimestamp || 0);
  if (Date.now() < unixTimestamp) {
    const prettyTimestamp = displayTimestampUtc(unixTimestamp);
    return (
      <div className="alert alert-warning text-center">
        <strong>Account is locked!</strong> Lockup expires on {prettyTimestamp}
      </div>
    );
  } else {
    return null;
  }
}

const TYPE_NAMES = {
  uninitialized: "Uninitialized",
  initialized: "Initialized",
  delegated: "Delegated",
  rewardsPool: "RewardsPool",
};

function displayStatus(
  stakeAccountType: StakeAccountType,
  activation?: StakeActivationData
) {
  let status = TYPE_NAMES[stakeAccountType];
  let activationState = "";
  if (stakeAccountType !== "delegated") {
    status = "Not delegated";
  } else {
    activationState = activation ? `(${activation.state})` : "";
  }

  return [status, activationState].join(" ");
}

function OverviewCard({
  account,
  stakeAccount,
  stakeAccountType,
  activation,
  hideDelegation,
}: {
  account: Account;
  stakeAccount: StakeAccountInfo;
  stakeAccountType: StakeAccountType;
  activation?: StakeActivationData;
  hideDelegation: boolean;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={
        <Typography variant="h3">Stake Account</Typography>
      }
      action={
        <Button size="small" variant="outlined"
          onClick={() => refresh(account.pubkey)}
        >
          Refresh
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableBody>

            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align="right">
                <Address pubkey={account.pubkey} alignRight raw />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Balance (VLX)</TableCell>
              <TableCell align="right">
                <SolBalance lamports={account.lamports || 0} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rent Reserve (VLX)</TableCell>
              <TableCell align="right">
                <SolBalance lamports={stakeAccount.meta.rentExemptReserve} />
              </TableCell>
            </TableRow>
            {hideDelegation && (
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell align="right">
                  {isFullyInactivated(stakeAccount, activation)
                    ? "Not delegated"
                    : displayStatus(stakeAccountType, activation)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function DelegationCard({
  stakeAccount,
  stakeAccountType,
  activation,
}: {
  stakeAccount: StakeAccountInfo;
  stakeAccountType: StakeAccountType;
  activation?: StakeActivationData;
}) {
  let voterPubkey, activationEpoch, deactivationEpoch;
  const delegation = stakeAccount?.stake?.delegation;
  if (delegation) {
    voterPubkey = delegation.voter;
    activationEpoch = delegation.activationEpoch.eq(MAX_EPOCH)
      ? "-"
      : delegation.activationEpoch.toString();
    deactivationEpoch = delegation.deactivationEpoch.eq(MAX_EPOCH)
      ? "-"
      : delegation.deactivationEpoch.toString();
  }
  const { stake } = stakeAccount;
  return (
    <ContentCard
      className="mt-6"
      title={<Typography variant="h3">Stake Delegation</Typography>}
    >
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">
                {displayStatus(stakeAccountType, activation)}
              </TableCell>
            </TableRow>

            {stake && (
              <>
                <TableRow>
                  <TableCell>Delegated Stake (VLX)</TableCell>
                  <TableCell align="right">
                    <SolBalance lamports={stake.delegation.stake} />
                  </TableCell>
                </TableRow>

                {activation && (
                  <>
                    <TableRow>
                      <TableCell>Active Stake (VLX)</TableCell>
                      <TableCell align="right">
                        <SolBalance lamports={activation.active} />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Inactive Stake (VLX)</TableCell>
                      <TableCell align="right">
                        <SolBalance lamports={activation.inactive} />
                      </TableCell>
                    </TableRow>
                  </>
                )}

                {voterPubkey && (
                  <TableRow>
                    <TableCell>Delegated Vote Address</TableCell>
                    <TableCell align="right">
                      <Address pubkey={voterPubkey} alignRight link />
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell>Activation Epoch</TableCell>
                  <TableCell align="right">{activationEpoch}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Deactivation Epoch</TableCell>
                  <TableCell align="right">{deactivationEpoch}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function AuthoritiesCard({ meta }: { meta: StakeMeta }) {
  const hasLockup = meta.lockup.unixTimestamp > 0;
  return (
    <ContentCard
      className="mt-6"
      title={<Typography variant="h3">Authorities</Typography>}
    >
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Stake Authority Address</TableCell>
              <TableCell align="right">
                <Address pubkey={meta.authorized.staker} alignRight link />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Withdraw Authority Address</TableCell>
              <TableCell align="right">
                <Address pubkey={meta.authorized.withdrawer} alignRight link />
              </TableCell>
            </TableRow>

            {hasLockup && (
              <TableRow>
                <TableCell>Lockup Authority Address</TableCell>
                <TableCell align="right">
                  <Address pubkey={meta.lockup.custodian} alignRight link />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function isFullyInactivated(
  stakeAccount: StakeAccountInfo,
  activation?: StakeActivationData
): boolean {
  const { stake } = stakeAccount;

  if (!stake || !activation) {
    return false;
  }

  return stake.delegation.stake.toString() === activation.inactive.toString();
}
