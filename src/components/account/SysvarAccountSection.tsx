import React from "react";
import { Account, useFetchAccountInfo } from "providers/accounts";
import {
  SysvarAccount,
  SysvarClockAccount,
  SysvarEpochScheduleAccount,
  SysvarFeesAccount,
  SysvarRecentBlockhashesAccount,
  SysvarRentAccount,
  SysvarRewardsAccount,
  SysvarSlotHashesAccount,
  SysvarSlotHistoryAccount,
  SysvarStakeHistoryAccount,
} from "validators/accounts/sysvar";
import { TableCardBody } from "components/common/TableCardBody";
import {
  AccountHeader,
  AccountAddressRow,
  AccountBalanceRow,
} from "components/common/Account";
import { displayTimestamp } from "utils/date";
import { Slot } from "components/common/Slot";
import ContentCard from "components/common/ContentCard";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

export function SysvarAccountSection({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarAccount;
}) {
  switch (sysvarAccount.type) {
    case "clock":
      return (
        <SysvarAccountClockCard
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "rent":
      return (
        <SysvarAccountRentCard
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "rewards":
      return (
        <SysvarAccountRewardsCard
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "epochSchedule":
      return (
        <SysvarAccountEpochScheduleCard
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "fees":
      return (
        <SysvarAccountFeesCard
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "recentBlockhashes":
      return (
        <SysvarAccountRecentBlockhashesCard
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "slotHashes":
      return (
        <SysvarAccountSlotHashes
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "slotHistory":
      return (
        <SysvarAccountSlotHistory
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
    case "stakeHistory":
      return (
        <SysvarAccountStakeHistory
          account={account}
          sysvarAccount={sysvarAccount}
        />
      );
  }
}

function SysvarAccountRecentBlockhashesCard({
  account,
}: {
  account: Account;
  sysvarAccount: SysvarRecentBlockhashesAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Recent Blockhashes</Typography>}
      action={(
        <Button variant="outlined" size="small"
          onClick={() => refresh(account.pubkey)}
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
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
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function SysvarAccountSlotHashes({
  account,
}: {
  account: Account;
  sysvarAccount: SysvarSlotHashesAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Slot Hashes</Typography>}
      action={(
        <Button variant="outlined" size="small"
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
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
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function SysvarAccountSlotHistory({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarSlotHistoryAccount;
}) {
  const refresh = useFetchAccountInfo();
  const history = Array.from(
    {
      length: 100,
    },
    (v, k) => sysvarAccount.info.nextSlot - k
  );
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Slot History</Typography>}
      action={(
        <Button variant="outlined" size="small"
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
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
            <TableRow>
              <TableCell>
                Slot History{" "}
                <span className="text-muted">(previous 100 slots)</span>
              </TableCell>
              <TableCell align="right">
                {history.map((val) => (
                  <p key={val} className="mb-0">
                    <Slot slot={val} link align="end"/>
                  </p>
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function SysvarAccountStakeHistory({
  account,
}: {
  account: Account;
  sysvarAccount: SysvarStakeHistoryAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Stake History</Typography>}
      action={(
        <Button variant="outlined" size="small"
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
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
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function SysvarAccountFeesCard({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarFeesAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Fees</Typography>}
      action={(
        <Button variant="outlined" size="small"
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
          onClick={() => refresh(account.pubkey)}
        >
          Refresh
        </Button>
      )}
    >
      <AccountAddressRow account={account} />
      <AccountBalanceRow account={account} />

      <TableRow>
        <TableCell>Lamports Per Signature</TableCell>
        <TableCell align="right">
          {sysvarAccount.info.feeCalculator.lamportsPerSignature}
        </TableCell>
      </TableRow>
    </ContentCard>
  );
}

function SysvarAccountEpochScheduleCard({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarEpochScheduleAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Epoch Schedule</Typography>}
      action={(
        <Button variant="outlined" size="small"
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
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

            <TableRow>
              <TableCell>Slots Per Epoch</TableCell>
              <TableCell align="right">{sysvarAccount.info.slotsPerEpoch}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Leader Schedule Slot Offset</TableCell>
              <TableCell align="right">
                {sysvarAccount.info.leaderScheduleSlotOffset}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Epoch Warmup Enabled</TableCell>
              <TableCell align="right">
                <code>{sysvarAccount.info.warmup ? "true" : "false"}</code>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>First Normal Epoch</TableCell>
              <TableCell align="right">
                {sysvarAccount.info.firstNormalEpoch}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>First Normal Slot</TableCell>
              <TableCell align="right">
                <Slot slot={sysvarAccount.info.firstNormalSlot} align="end"/>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function SysvarAccountClockCard({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarClockAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Clock</Typography>}
      action={(
        <Button variant="outlined" size="small"
          startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
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

            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell align="right">
                {displayTimestamp(sysvarAccount.info.unixTimestamp * 1000)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Epoch</TableCell>
              <TableCell align="right">{sysvarAccount.info.epoch}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Leader Schedule Epoch</TableCell>
              <TableCell align="right">
                {sysvarAccount.info.leaderScheduleEpoch}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Slot</TableCell>
              <TableCell align="right">
                <Slot slot={sysvarAccount.info.slot} link align="end"/>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function SysvarAccountRentCard({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarRentAccount;
}) {
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Rent</Typography>}
      action={(<Button variant="outlined" size="small"
        startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
        onClick={() => refresh(account.pubkey)}
      >
        Refresh
      </Button>)}
    >
      <AccountAddressRow account={account} />
      <AccountBalanceRow account={account} />

      <TableRow>
        <TableCell>Burn Percent</TableCell>
        <TableCell align="right">
          {sysvarAccount.info.burnPercent + "%"}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Exemption Threshold</TableCell>
        <TableCell align="right">
          {sysvarAccount.info.exemptionThreshold} years
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Lamports Per Byte Year</TableCell>
        <TableCell align="right">
          {sysvarAccount.info.lamportsPerByteYear}
        </TableCell>
      </TableRow>
    </ContentCard>
  );
}

function SysvarAccountRewardsCard({
  account,
  sysvarAccount,
}: {
  account: Account;
  sysvarAccount: SysvarRewardsAccount;
}) {
  const refresh = useFetchAccountInfo();

  const validatorPointValueFormatted = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 20,
  }).format(sysvarAccount.info.validatorPointValue);

  return (
    <ContentCard
      title={<Typography variant="h3">Sysvar: Rewards</Typography>}
      action={(<Button variant="outlined" size="small"
        startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
      >
        Refresh
      </Button>)}
    >
        <AccountAddressRow account={account} />
        <AccountBalanceRow account={account} />

        <TableRow>
          <TableCell>Validator Point Value</TableCell>
          <TableCell align="right">
            {validatorPointValueFormatted} lamports
          </TableCell>
        </TableRow>
    </ContentCard>
  );
}
