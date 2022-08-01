import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import ContentCard from "components/common/ContentCard";
import { Slot } from "components/common/Slot";
import {
  SysvarAccount,
  SlotHashesInfo,
  SlotHashEntry,
} from "validators/accounts/sysvar";

export function SlotHashesCard({
  sysvarAccount,
}: {
  sysvarAccount: SysvarAccount;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const slotHashes = sysvarAccount.info as SlotHashesInfo;  

  const renderAccountRow = (entry: SlotHashEntry, index: number) => {
    
    return (
      <TableRow key={index}>
        <TableCell>
          <Slot slot={entry.slot} link />
        </TableCell>
        <TableCell  align={matches?"right":"left"}>{entry.hash}</TableCell>
      </TableRow>
    );
  };
  
  return (
    <ContentCard
      title={<Typography variant="h4">Slot Hashes</Typography>}
      footer={slotHashes.length > 0 ? null : (
        <div className="p-4 text-center">
          No hashes found
        </div>
      )}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Slot</TableCell>
              <TableCell  align={matches?"right":"left"}>Blockhash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slotHashes.length > 0 &&
              slotHashes.map((entry: SlotHashEntry, index) => {
                return renderAccountRow(entry, index);
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
