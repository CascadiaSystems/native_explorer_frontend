import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import ContentCard from "components/common/ContentCard";
import { Slot } from "components/common/Slot";
import { VoteAccount, Vote } from "validators/accounts/vote";

export function VotesCard({ voteAccount }: { voteAccount: VoteAccount }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

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
              <TableCell  align={matches?"right":"left"}>Confirmation Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voteAccount.info.votes.length > 0 &&
              voteAccount.info.votes
                .reverse()
                .map((vote: Vote, index) => RenderAccountRow(vote, index))}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

const RenderAccountRow = (vote: Vote, index: number) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <TableRow key={index}>
      <TableCell className="w-1 font-mono">
        <Slot slot={vote.slot} link />
      </TableCell>
      <TableCell  align={matches?"right":"left"}>{vote.confirmationCount}</TableCell>
    </TableRow>
  );
};
