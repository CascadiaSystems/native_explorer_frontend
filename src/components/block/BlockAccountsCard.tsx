import React from "react";
import { BlockResponse, PublicKey } from "@velas/web3";
import { Address } from "components/common/Address";
import ContentCard from "components/common/ContentCard";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

type AccountStats = {
  reads: number;
  writes: number;
};

const PAGE_SIZE = 25;

export function BlockAccountsCard({ block }: { block: BlockResponse }) {
  const [numDisplayed, setNumDisplayed] = React.useState(10);
  const totalTransactions = block.transactions.length;

  const accountStats = React.useMemo(() => {
    const statsMap = new Map<string, AccountStats>();
    block.transactions.forEach((tx) => {
      const message = tx.transaction.message;
      const txSet = new Map<string, boolean>();
      message.instructions.forEach((ix) => {
        ix.accounts.forEach((index) => {
          const address = message.accountKeys[index].toBase58();
          txSet.set(address, message.isAccountWritable(index));
        });
      });

      txSet.forEach((isWritable, address) => {
        const stats = statsMap.get(address) || { reads: 0, writes: 0 };
        if (isWritable) {
          stats.writes++;
        } else {
          stats.reads++;
        }
        statsMap.set(address, stats);
      });
    });

    const accountEntries = [];
    for (let entry of statsMap) {
      accountEntries.push(entry);
    }

    accountEntries.sort((a, b) => {
      const aCount = a[1].reads + a[1].writes;
      const bCount = b[1].reads + b[1].writes;
      if (aCount < bCount) return 1;
      if (aCount > bCount) return -1;
      return 0;
    });

    return accountEntries;
  }, [block]);

  return (
    <ContentCard
      title={<Typography variant="h4">Block Account Usage</Typography>}
      footer={accountStats.length > numDisplayed && (
        <Button
          variant="contained"
          className="w-full"
          onClick={() =>
            setNumDisplayed((displayed) => displayed + PAGE_SIZE)
          }
        >
          Load More
        </Button>
      )}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Read-Write Count</TableCell>
              <TableCell>Read-Only Count</TableCell>
              <TableCell align="right">Total Count</TableCell>
              <TableCell align="right">% of Transactions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountStats
              .slice(0, numDisplayed)
              .map(([address, { writes, reads }]) => {
                return (
                  <TableRow key={address}>
                    <TableCell>
                      <Address pubkey={new PublicKey(address)} link />
                    </TableCell>
                    <TableCell>{writes}</TableCell>
                    <TableCell>{reads}</TableCell>
                    <TableCell align="right">{writes + reads}</TableCell>
                    <TableCell align="right">
                      {((100 * (writes + reads)) / totalTransactions).toFixed(
                        2
                      )}
                      %
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
