import { Account } from "providers/accounts";
import { SolBalance } from "utils";
import { Address } from "components/common/Address";
import { addressLabel } from "utils/tx";
import { useCluster } from "providers/cluster";
import { useTokenRegistry } from "providers/mints/token-registry";

import ContentCard from "../../components/common/ContentCard";
import { TableContainer, Table, TableBody, TableRow, TableCell, Typography, useTheme, useMediaQuery } from "@mui/material";

export function UnknownAccountCard({ account }: { account: Account }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { details, lamports } = account;
  const { cluster } = useCluster();
  const { tokenRegistry } = useTokenRegistry();
  if (lamports === undefined) return null;

  const label = addressLabel(account.pubkey.toBase58(), cluster, tokenRegistry);
  return (
    <ContentCard
      title={(
        <Typography variant="h3"> Overview </Typography>
      )}
    >
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell> Address </TableCell>
              <TableCell align={matches?"right":"left"}><Address pubkey={account.pubkey} alignRight={matches} raw /></TableCell>
            </TableRow>
            {label && (
              <TableRow>
                <TableCell> Address Label </TableCell>
                <TableCell align={matches?"right":"left"}> { label } </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell> Balance (VLX) </TableCell>
              <TableCell align={matches?"right":"left"}><SolBalance lamports={lamports} /></TableCell>
            </TableRow>
            {details?.space !== undefined && (
              <>
                <TableRow>
                  <TableCell> Owner </TableCell>
                  <TableCell align={matches?"right":"left"}> { details.space } </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> Data (Bytes) </TableCell>
                  <TableCell align={matches?"right":"left"}><Address pubkey={details.owner} alignRight={matches} link /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> Executable </TableCell>
                  <TableCell align={matches?"right":"left"}> { details.executable ? "Yes" : "No" } </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
