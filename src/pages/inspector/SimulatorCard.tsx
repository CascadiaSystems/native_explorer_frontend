import React from "react";
import bs58 from "bs58";
import { Connection, Message, Transaction } from "@velas/web3";
import { useCluster } from "providers/cluster";
import { programLabel } from "utils/tx";
import ContentCard from "components/common/ContentCard";
import { Chip, Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

type LogMessage = {
  text: string;
  prefix: string;
  style: "muted" | "info" | "success" | "warning";
};

type InstructionLogs = {
  logs: LogMessage[];
  failed: boolean;
};

const DEFAULT_SIGNATURE = bs58.encode(Buffer.alloc(64).fill(0));

export function SimulatorCard({ message, className }: { message: Message, className?: string }) {
  const { cluster } = useCluster();
  const {
    simulate,
    simulating,
    simulationLogs: logs,
    simulationError,
  } = useSimulator(message);
  if (simulating) {
    return (
      <ContentCard
        title={<Typography variant="h3">Transaction Simulation</Typography>}
        className={className}
      >
        <div className="p-4 text-center">
          <span className="spinner-grow spinner-grow-sm mr-2"></span>
          Simulating
        </div>
      </ContentCard>
    );
  } else if (!logs) {
    return (
      <ContentCard
        title={<Typography variant="h3">Transaction Simulation</Typography>}
        action={(
          <Button variant="outlined" size="small" onClick={simulate}>
            Simulate
          </Button>
        )}
        className={className}
      >
        {simulationError ? (
          <div>
            Failed to run simulation:
            <span className="text-warning ml-2">{simulationError}</span>
          </div>
        ) : (
          <div className="text-secondary p-8 pl-12">
            <ul className="list-disc">
              <li>
                Simulation is free and will run this transaction against the
                latest confirmed ledger state.
              </li>
              <li>
                No state changes will be persisted and all signature checks will
                be disabled.
              </li>
            </ul>
          </div>
        )}
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title={<Typography variant="h3">Transaction Simulation</Typography>}
      action={(
        <Button variant="outlined" size="small"
          onClick={simulate}
        >
          Retry
        </Button>
      )}
      className={className}
    >
      <TableContainer>
        <Table>
          <TableBody>
            {message.instructions.map((ix, index) => {
              const programId = message.accountKeys[ix.programIdIndex];
              const programName =
                programLabel(programId.toBase58(), cluster) || "Unknown";
              const programLogs: InstructionLogs | undefined = logs[index];

              let badgeColor = "white";
              if (programLogs) {
                badgeColor = programLogs.failed ? "warning" : "success";
              }

              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Chip variant="filled" size="small" label={`#${index + 1}`} />
                      {programName} Instruction
                    </div>
                    {programLogs && (
                      <div className="flex items-start flex-col font-mono p-2">
                        {programLogs.logs.map((log, key) => {
                          return (
                            <span key={key}>
                              <span className="text-muted">{log.prefix}</span>
                              <span className={`text-${log.style}`}>
                                {log.text}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
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

function useSimulator(message: Message) {
  const { cluster, url } = useCluster();
  const [simulating, setSimulating] = React.useState(false);
  const [logs, setLogs] = React.useState<Array<InstructionLogs> | null>(null);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    setLogs(null);
    setSimulating(false);
    setError(undefined);
  }, [url]);

  const onClick = React.useCallback(() => {
    if (simulating) return;
    setError(undefined);
    setSimulating(true);

    const connection = new Connection(url, "confirmed");
    (async () => {
      try {
        const tx = Transaction.populate(
          message,
          new Array(message.header.numRequiredSignatures).fill(
            DEFAULT_SIGNATURE
          )
        );

        // Simulate without signers to skip signer verification
        const resp = await connection.simulateTransaction(tx);

        let depth = 0;
        let instructionLogs: InstructionLogs[] = [];
        const prefixBuilder = (depth: number) => {
          const prefix = new Array(depth - 1).fill("\u00A0\u00A0").join("");
          return prefix + "> ";
        };

        let instructionError;
        const responseLogs = resp.value.logs;
        const responseErr = resp.value.err;
        if (!responseLogs) {
          if (resp.value.err) throw new Error(JSON.stringify(responseErr));
          throw new Error("No logs detected");
        } else if (responseErr) {
          if (typeof responseErr !== "string") {
            let ixError = (responseErr as any)["InstructionError"];
            const [index, message] = ixError;
            if (typeof message === "string") {
              instructionError = { index, message };
            }
          } else {
            throw new Error(responseErr);
          }
        }

        responseLogs.forEach((log) => {
          if (log.startsWith("Program log:")) {
            instructionLogs[instructionLogs.length - 1].logs.push({
              prefix: prefixBuilder(depth),
              text: log,
              style: "muted",
            });
          } else {
            const regex = /Program (\w*) invoke \[(\d)\]/g;
            const matches = [...log.matchAll(regex)];

            if (matches.length > 0) {
              const programAddress = matches[0][1];
              const programName =
                programLabel(programAddress, cluster) ||
                `Unknown (${programAddress}) Program`;

              if (depth === 0) {
                instructionLogs.push({
                  logs: [],
                  failed: false,
                });
              } else {
                instructionLogs[instructionLogs.length - 1].logs.push({
                  prefix: prefixBuilder(depth),
                  style: "info",
                  text: `Invoking ${programName}`,
                });
              }

              depth++;
            } else if (log.includes("success")) {
              instructionLogs[instructionLogs.length - 1].logs.push({
                prefix: prefixBuilder(depth),
                style: "success",
                text: `Program returned success`,
              });
              depth--;
            } else if (log.includes("failed")) {
              const instructionLog =
                instructionLogs[instructionLogs.length - 1];
              if (!instructionLog.failed) {
                instructionLog.failed = true;
                instructionLog.logs.push({
                  prefix: prefixBuilder(depth),
                  style: "warning",
                  text: `Program returned error: ${log.slice(
                    log.indexOf(": ") + 2
                  )}`,
                });
              }
              depth--;
            } else {
              if (depth === 0) {
                instructionLogs.push({
                  logs: [],
                  failed: false,
                });
                depth++;
              }
              // system transactions don't start with "Program log:"
              instructionLogs[instructionLogs.length - 1].logs.push({
                prefix: prefixBuilder(depth),
                text: log,
                style: "muted",
              });
            }
          }
        });

        // If the instruction's simulation returned an error without any logs then add an empty log entry for Runtime error
        // For example BpfUpgradableLoader fails without returning any logs for Upgrade instruction with buffer that doesn't exist
        if (instructionError && instructionLogs.length === 0) {
          instructionLogs.push({
            logs: [],
            failed: true,
          });
        }

        if (
          instructionError &&
          instructionError.index === instructionLogs.length - 1
        ) {
          const failedIx = instructionLogs[instructionError.index];
          failedIx.failed = true;
          failedIx.logs.push({
            prefix: prefixBuilder(1),
            text: `Runtime error: ${instructionError.message}`,
            style: "warning",
          });
        }

        setLogs(instructionLogs);
      } catch (err) {
        console.error(err);
        setLogs(null);
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setSimulating(false);
      }
    })();
  }, [cluster, url, message, simulating]);
  return {
    simulate: onClick,
    simulating,
    simulationLogs: logs,
    simulationError: error,
  };
}
