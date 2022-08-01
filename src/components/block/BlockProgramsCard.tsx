import React from "react";
import { BlockResponse, PublicKey } from "@velas/web3";
import { Address } from "components/common/Address";
import ContentCard from "components/common/ContentCard";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";

export function BlockProgramsCard({ block }: { block: BlockResponse }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const totalTransactions = block.transactions.length;
  const txSuccesses = new Map<string, number>();
  const txFrequency = new Map<string, number>();
  const ixFrequency = new Map<string, number>();

  let totalInstructions = 0;
  block.transactions.forEach((tx) => {
    const message = tx.transaction.message;
    totalInstructions += message.instructions.length;
    const programUsed = new Set<string>();
    const trackProgram = (index: number) => {
      if (index >= message.accountKeys.length) return;
      const programId = message.accountKeys[index];
      const programAddress = programId.toBase58();
      programUsed.add(programAddress);
      const frequency = ixFrequency.get(programAddress);
      ixFrequency.set(programAddress, frequency ? frequency + 1 : 1);
    };

    message.instructions.forEach((ix) => trackProgram(ix.programIdIndex));
    tx.meta?.innerInstructions?.forEach((inner) => {
      totalInstructions += inner.instructions.length;
      inner.instructions.forEach((innerIx) =>
        trackProgram(innerIx.programIdIndex)
      );
    });

    const successful = tx.meta?.err === null;
    programUsed.forEach((programId) => {
      const frequency = txFrequency.get(programId);
      txFrequency.set(programId, frequency ? frequency + 1 : 1);
      if (successful) {
        const count = txSuccesses.get(programId);
        txSuccesses.set(programId, count ? count + 1 : 1);
      }
    });
  });

  const programEntries = [];
  for (let entry of txFrequency) {
    programEntries.push(entry);
  }

  programEntries.sort((a, b) => {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  });

  return (
    <>
      <ContentCard
        title={<Typography variant="h4">Block Program Stats</Typography>}
      >
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Unique Programs Count</TableCell>
                <TableCell  align={matches?"right":"left"}>
                  {programEntries.length}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Instructions</TableCell>
                <TableCell  align={matches?"right":"left"}>
                  {totalInstructions}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ContentCard>

      <ContentCard
        className="mt-6"
        title={<Typography variant="h4">Block Programs</Typography>}
      >
        {programEntries.length ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell>Transaction Count</TableCell>
                  <TableCell>% of Total</TableCell>
                  <TableCell  align={matches?"right":"left"}>Instruction Count</TableCell>
                  <TableCell  align={matches?"right":"left"}>% of Total</TableCell>
                  <TableCell  align={matches?"right":"left"}>Success Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programEntries.map(([programId, txFreq]) => {
                  const ixFreq = ixFrequency.get(programId) as number;
                  const successes = txSuccesses.get(programId) || 0;
                  return (
                    <TableRow key={programId}>
                      <TableCell>
                        <Address pubkey={new PublicKey(programId)} link />
                      </TableCell>
                      <TableCell>{txFreq}</TableCell>
                      <TableCell>{((100 * txFreq) / totalTransactions).toFixed(2)}%</TableCell>
                      <TableCell  align={matches?"right":"left"}>{ixFreq}</TableCell>
                      <TableCell  align={matches?"right":"left"}>{((100 * ixFreq) / totalInstructions).toFixed(2)}%</TableCell>
                      <TableCell  align={matches?"right":"left"}>{((100 * successes) / txFreq).toFixed(0)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="p-4 text-center">
            This block has no programs.
          </div>
        )}
      </ContentCard>
    </>
  );
}
