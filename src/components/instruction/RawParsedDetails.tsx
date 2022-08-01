import React from "react";
import { ParsedInstruction } from "@velas/web3";
import { TableRow, TableCell, useTheme, useMediaQuery } from "@mui/material";

export function RawParsedDetails({
  ix,
  children,
}: {
  ix: ParsedInstruction;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <>
      {children}
      <TableRow>
        <TableCell>
          Instruction Data (JSON)
        </TableCell>
        <TableCell  align={matches?"right":"left"}>
          <pre className="inline-block p-3 bg-grey-dark text-left">
            {JSON.stringify(ix.parsed, null, 2)}
          </pre>
        </TableCell>
      </TableRow>
    </>
  );
}
