import React from "react";
import { ParsedInstruction } from "@velas/web3";
import { TableRow, TableCell } from "@mui/material";

export function RawParsedDetails({
  ix,
  children,
}: {
  ix: ParsedInstruction;
  children?: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TableRow>
        <TableCell>
          Instruction Data (JSON)
        </TableCell>
        <TableCell align="right">
          <pre className="inline-block p-3 bg-grey-dark text-left">
            {JSON.stringify(ix.parsed, null, 2)}
          </pre>
        </TableCell>
      </TableRow>
    </>
  );
}
