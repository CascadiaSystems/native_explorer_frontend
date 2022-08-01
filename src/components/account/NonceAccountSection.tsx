import React from "react";
import { Account, useFetchAccountInfo } from "providers/accounts";
import { TableCardBody } from "components/common/TableCardBody";
import { Address } from "components/common/Address";
import { NonceAccount } from "validators/accounts/nonce";
import {
  AccountHeader,
  AccountAddressRow,
  AccountBalanceRow,
} from "components/common/Account";
import ContentCard from "components/common/ContentCard";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

export function NonceAccountSection({
  account,
  nonceAccount,
}: {
  account: Account;
  nonceAccount: NonceAccount;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const refresh = useFetchAccountInfo();
  return (
    <ContentCard
      title={<Typography variant="h3">Nonce Account</Typography>}
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
              <TableCell>Authority</TableCell>
              <TableCell align={matches?"right":"left"}>
                <Address pubkey={nonceAccount.info.authority} alignRight={matches} raw link />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Blockhash</TableCell>
              <TableCell align={matches?"right":"left"}>
                <code>{nonceAccount.info.blockhash}</code>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Fee</TableCell>
              <TableCell align={matches?"right":"left"}>
                {nonceAccount.info.feeCalculator.lamportsPerSignature} lamports per
                signature
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
