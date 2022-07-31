import React from "react";
import { TransactionInstruction } from "@velas/web3";
import { Address } from "components/common/Address";
import { Chip, TableCell, TableRow } from "@mui/material";

export function RawDetails({ ix }: { ix: TransactionInstruction }) {
  const data = ix.data.toString("hex");
  return (
    <>
      {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => (
        <TableRow key={keyIndex}>
          <TableCell>
            <div className="flex flex-row gap-2 items-center">
              Account #{keyIndex + 1}
              {!isWritable && (
                <Chip label="Readonly" variant="filled" size="small"/>
                )}
              {isSigner && (
                <Chip label="Signer" variant="filled" size="small"/>
              )}
            </div>
          </TableCell>
          <TableCell align="right">
            <Address pubkey={pubkey} alignRight link />
          </TableCell>
        </TableRow>
      ))}

      <TableRow>
        <TableCell>
          Instruction Data <span className="text-muted">(Hex)</span>
        </TableCell>
        <TableCell align="right">
          <pre className="p-2 bg-grey-dark inline-block text-left max-w-md whitespace-pre-wrap break-words overflow-auto">{data}</pre>
          {/* {data} */}
        </TableCell>
      </TableRow>
    </>
  );
}
