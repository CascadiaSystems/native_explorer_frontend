import React from "react";
import { SolBalance } from "utils";
import { BlockResponse, PublicKey } from "@velas/web3";
import { Address } from "components/common/Address";
import ContentCard from "components/common/ContentCard";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Button, useMediaQuery, useTheme } from "@mui/material";

const PAGE_SIZE = 10;

export function BlockRewardsCard({ block }: { block: BlockResponse }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [rewardsDisplayed, setRewardsDisplayed] = React.useState(PAGE_SIZE);

  if (!block.rewards || block.rewards.length < 1) {
    return null;
  }

  return (
    <ContentCard
      title={<Typography variant="h4">Block Rewards</Typography>}
      footer={block.rewards.length > rewardsDisplayed && (
        <Button
          variant="contained"
          className="w-full"
          onClick={() =>
            setRewardsDisplayed((displayed) => displayed + PAGE_SIZE)
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
              <TableCell>Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell  align={matches?"right":"left"}>Amount</TableCell>
              <TableCell  align={matches?"right":"left"}>New Balance</TableCell>
              <TableCell  align={matches?"right":"left"}>Percent Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {block.rewards.map((reward, index) => {
              if (index >= rewardsDisplayed - 1) {
                return null;
              }

              let percentChange;
              if (reward.postBalance !== null && reward.postBalance !== 0) {
                percentChange = (
                  (Math.abs(reward.lamports) /
                    (reward.postBalance - reward.lamports)) *
                  100
                ).toFixed(9);
              }
              return (
                <TableRow key={reward.pubkey + reward.rewardType}>
                  <TableCell>
                    <Address pubkey={new PublicKey(reward.pubkey)} link />
                  </TableCell>
                  <TableCell>{reward.rewardType}</TableCell>
                  <TableCell  align={matches?"right":"left"}>
                    <SolBalance lamports={reward.lamports} />
                  </TableCell>
                  <TableCell  align={matches?"right":"left"}>
                    {reward.postBalance ? (
                      <SolBalance lamports={reward.postBalance} />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell  align={matches?"right":"left"}>{percentChange ? percentChange + "%" : "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
