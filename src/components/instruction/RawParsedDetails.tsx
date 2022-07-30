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
        <TableCell>
          <div className="flex justify-end">
            <div className="p-4 bg-grey-dark">
              <pre className="d-inline-block text-left json-wrap">
                {JSON.stringify(ix.parsed, null, 2)}
              </pre>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
