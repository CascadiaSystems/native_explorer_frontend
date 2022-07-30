import { Account } from "providers/accounts";
import { SolBalance } from "utils";
import { Address } from "components/common/Address";
import { addressLabel } from "utils/tx";
import { useCluster } from "providers/cluster";
import { useTokenRegistry } from "providers/mints/token-registry";

import ContentCard from "../../components/common/ContentCard";
import { TableContainer, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";

export function UnknownAccountCard({ account }: { account: Account }) {
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
              <TableCell align="right"><Address pubkey={account.pubkey} alignRight raw /></TableCell>
            </TableRow>
            {label && (
              <TableRow>
                <TableCell> Address Label </TableCell>
                <TableCell align="right"> { label } </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell> Balance (VLX) </TableCell>
              <TableCell align="right"><SolBalance lamports={lamports} /></TableCell>
            </TableRow>
            {details?.space !== undefined && (
              <>
                <TableRow>
                  <TableCell> Owner </TableCell>
                  <TableCell align="right"> { details.space } </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> Data (Bytes) </TableCell>
                  <TableCell align="right"><Address pubkey={details.owner} alignRight link /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> Executable </TableCell>
                  <TableCell align="right"> { details.executable ? "Yes" : "No" } </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
