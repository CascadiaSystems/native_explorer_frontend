import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ContentCard from "components/common/ContentCard";
import { Slot } from "components/common/Slot";
import { VoteAccount, Vote } from "validators/accounts/vote";

export function VotesCard({ voteAccount }: { voteAccount: VoteAccount }) {
  return (
    <ContentCard
      title={<Typography variant="h4">Vote History</Typography>}
      footer={voteAccount.info.votes.length > 0 ? "" : "No votes found"}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Slot</TableCell>
              <TableCell align="right">Confirmation Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voteAccount.info.votes.length > 0 &&
              voteAccount.info.votes
                .reverse()
                .map((vote: Vote, index) => renderAccountRow(vote, index))}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

const renderAccountRow = (vote: Vote, index: number) => {
  return (
    <TableRow key={index}>
      <TableCell className="w-1 font-mono">
        <Slot slot={vote.slot} link />
      </TableCell>
      <TableCell align="right">{vote.confirmationCount}</TableCell>
    </TableRow>
  );
};
