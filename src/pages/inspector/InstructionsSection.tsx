import React from "react";
import bs58 from "bs58";
import { CompiledInstruction, Message } from "@velas/web3";
import { AddressWithContext, programValidator } from "./AddressWithContext";
import { useCluster } from "providers/cluster";
import { programLabel } from "utils/tx";
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import ContentCard from "components/common/ContentCard";

export function InstructionsSection({ message }: { message: Message }) {
  return (
    <>
      {message.instructions.map((ix, index) => {
        return <InstructionCard key={index} {...{ message, ix, index }} />;
      })}
    </>
  );
}

function InstructionCard({
  message,
  ix,
  index,
}: {
  message: Message;
  ix: CompiledInstruction;
  index: number;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const { cluster } = useCluster();
  const programId = message.accountKeys[ix.programIdIndex];
  const programName = programLabel(programId.toBase58(), cluster) || "Unknown";

  let data: string = "No data";
  if (ix.data) {
    data = "";

    const chunks = [];
    const hexString = bs58.decode(ix.data).toString("hex");
    for (let i = 0; i < hexString.length; i += 2) {
      chunks.push(hexString.slice(i, i + 2));
    }

    data = chunks.join(" ");
  }

  return (

    <div className="card" id={`instruction-index-${index + 1}`} key={index}>
      <ContentCard
        title={(
          <div className="flex items-center gap-2">
            <Chip variant="filled" label={`#{index + 1}`} />
            <Typography variant="h3"> {`${programName} Instruction`} </Typography>
          </div>
        )}
        action={(
          <Button variant="outlined" size="small"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
        )}
      >
        {expanded && (
          <TableContainer>
            <Table>
              <TableBody>                
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell align="right">
                    <AddressWithContext
                      pubkey={message.accountKeys[ix.programIdIndex]}
                      validator={programValidator}
                    />
                  </TableCell>
                </TableRow>
                {ix.accounts.map((accountIndex, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-start flex-col">
                          Account #{index + 1}
                          <span className="mt-1">
                            {accountIndex < message.header.numRequiredSignatures && (
                              <Chip label="Signer" variant="filled" size="small" />
                              )}
                            {message.isAccountWritable(accountIndex) && (
                              <Chip label="Writable" variant="filled" size="small" />
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <AddressWithContext
                          pubkey={message.accountKeys[accountIndex]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell>
                    Instruction Data <span className="text-muted">(Hex)</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <div className="p-4 bg-grey-dark">
                        <pre className="d-inline-block text-left mb-0 data-wrap">
                          {data}
                        </pre>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ContentCard>
    </div>
  );
}
