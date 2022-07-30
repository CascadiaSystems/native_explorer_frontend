import React from "react";
import { Account, useFetchAccountInfo } from "providers/accounts";
import { Address } from "components/common/Address";
import { VoteAccount } from "validators/accounts/vote";
import { displayTimestamp } from "utils/date";
import {
  AccountAddressRow,
  AccountBalanceRow,
} from "components/common/Account";
import { Slot } from "components/common/Slot";
import ContentCard from "components/common/ContentCard";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

export function VoteAccountSection({
  account,
  voteAccount,
}: {
  account: Account;
  voteAccount: VoteAccount;
}) {
  const refresh = useFetchAccountInfo();
  const rootSlot = voteAccount.info.rootSlot;
  return (
    <>
      <ContentCard
        title={<Typography variant="h3">Vote Account</Typography>}
        action={(
          <Button variant="outlined"
            size="small"
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
                  Authorized Voter
                  {voteAccount.info.authorizedVoters.length > 1 ? "s" : ""}
                </TableCell>
                <TableCell align="right">
                  {voteAccount.info.authorizedVoters.map((voter) => {
                    return (
                      <Address
                        pubkey={voter.authorizedVoter}
                        key={voter.authorizedVoter.toString()}
                        alignRight
                        raw
                        link
                      />
                    );
                  })}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Authorized Withdrawer</TableCell>
                <TableCell align="right">
                  <Address
                    pubkey={voteAccount.info.authorizedWithdrawer}
                    alignRight
                    raw
                    link
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Last Timestamp</TableCell>
                <TableCell align="right">
                  {displayTimestamp(voteAccount.info.lastTimestamp.timestamp * 1000)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Commission</TableCell>
                <TableCell align="right">{voteAccount.info.commission + "%"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Root Slot</TableCell>
                <TableCell align="right">
                  {rootSlot !== null ? <Slot slot={rootSlot} link /> : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ContentCard> 
    </>
  );
}
