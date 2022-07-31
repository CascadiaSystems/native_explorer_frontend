import React from "react";
import { BlockResponse } from "@velas/web3";
import { ErrorCard } from "components/common/ErrorCard";
import { Signature } from "components/common/Signature";
import ContentCard from "components/common/ContentCard";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from "@mui/material";

const PAGE_SIZE = 25;

export function BlockHistoryCard({ block }: { block: BlockResponse }) {
  const [numDisplayed, setNumDisplayed] = React.useState(PAGE_SIZE);

  if (block.transactions.length === 0) {
    return <ErrorCard text="This block has no transactions" />;
  }

  return (
    <ContentCard
      title={<Typography variant="h4">Block Transactions</Typography>}
      footer={block.transactions.length > numDisplayed && (
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
              <TableCell>Result</TableCell>
              <TableCell align="right">Transaction Signature</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {block.transactions.slice(0, numDisplayed).map((tx, i) => {
              let statusText;
              let statusClass;
              let signature: React.ReactNode;
              if (tx.meta?.err || tx.transaction.signatures.length === 0) {
                statusClass = "warning";
                statusText = "Failed";
              } else {
                statusClass = "success";
                statusText = "Success";
              }

              if (tx.transaction.signatures.length > 0) {
                signature = (
                  <Signature signature={tx.transaction.signatures[0]} link alignRight/>
                );
              }

              return (
                <TableRow key={i}>
                  <TableCell>
                    <span className={`badge badge-soft-${statusClass}`}>
                      {statusText}
                    </span>
                  </TableCell>

                  <TableCell align="right">{signature}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
