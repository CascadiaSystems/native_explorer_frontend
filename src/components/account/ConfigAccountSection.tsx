import React from "react";
import { Account, useFetchAccountInfo } from "providers/accounts";
import { TableCardBody } from "components/common/TableCardBody";
import {
  ConfigAccount,
  StakeConfigInfoAccount,
  ValidatorInfoAccount,
} from "validators/accounts/config";
import {
  AccountAddressRow,
  AccountBalanceRow,
  AccountHeader,
} from "components/common/Account";
import { PublicKey } from "@velas/web3";
import { Address } from "components/common/Address";
import ContentCard from "components/common/ContentCard";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const MAX_SLASH_PENALTY = Math.pow(2, 8);

export function ConfigAccountSection({
  account,
  configAccount,
}: {
  account: Account;
  configAccount: ConfigAccount;
}) {
  switch (configAccount.type) {
    case "stakeConfig":
      return (
        <StakeConfigCard account={account} configAccount={configAccount} />
      );
    case "validatorInfo":
      return (
        <ValidatorInfoCard account={account} configAccount={configAccount} />
      );
  }
}

function StakeConfigCard({
  account,
  configAccount,
}: {
  account: Account;
  configAccount: StakeConfigInfoAccount;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const refresh = useFetchAccountInfo();

  const warmupCooldownFormatted = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(configAccount.info.warmupCooldownRate);

  const slashPenaltyFormatted = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(configAccount.info.slashPenalty / MAX_SLASH_PENALTY);

  return (
    <div className="card">
      <AccountHeader
        title="Stake Config"
        refresh={() => refresh(account.pubkey)}
      />

      <TableCardBody>
        <AccountAddressRow account={account} />
        <AccountBalanceRow account={account} />

        <TableRow>
          <TableCell>Warmup / Cooldown Rate</TableCell>
          <TableCell align={matches?"right":"left"}>{warmupCooldownFormatted}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Slash Penalty</TableCell>
          <TableCell align={matches?"right":"left"}>{slashPenaltyFormatted}</TableCell>
        </TableRow>
      </TableCardBody>
    </div>
  );
}

function ValidatorInfoCard({
  account,
  configAccount,
}: {
  account: Account;
  configAccount: ValidatorInfoAccount;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const refresh = useFetchAccountInfo();
  return (
    <>
      <ContentCard
        title={<Typography variant="h3">Validator Info</Typography>}
        action={(
          <Button variant="outlined" size="small" startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
            onClick={() => refresh(account.pubkey)}
          >
            Refresh
          </Button>
        )}
      >
        <TableContainer>
          <Table>
            <TableBody>
              <AccountAddressRow account={account} />
              <AccountBalanceRow account={account} />

              {configAccount.info.configData.name && (
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align={matches?"right":"left"}>
                    {configAccount.info.configData.name}
                  </TableCell>
                </TableRow>
              )}

              {configAccount.info.configData.keybaseUsername && (
                <TableRow>
                  <TableCell>Keybase Username</TableCell>
                  <TableCell align={matches?"right":"left"}>
                    {configAccount.info.configData.keybaseUsername}
                  </TableCell>
                </TableRow>
              )}

              {configAccount.info.configData.website && (
                <TableRow>
                  <TableCell>Website</TableCell>
                  <TableCell align={matches?"right":"left"}>
                    <a
                      href={configAccount.info.configData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {configAccount.info.configData.website}
                    </a>
                  </TableCell>
                </TableRow>
              )}

              {configAccount.info.configData.details && (
                <TableRow>
                  <TableCell>Details</TableCell>
                  <TableCell align={matches?"right":"left"}>
                    {configAccount.info.configData.details}
                  </TableCell>
                </TableRow>
              )}

              {configAccount.info.keys && configAccount.info.keys.length > 1 && (
                <TableRow>
                  <TableCell>Signer</TableCell>
                  <TableCell align={matches?"right":"left"}>
                    <Address
                      pubkey={new PublicKey(configAccount.info.keys[1].pubkey)}
                      link
                      alignRight={matches}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </ContentCard>
    </>
  );
}
