import React from "react";
import { ParsedInstruction, PublicKey, SignatureResult } from "@velas/web3";
import { InstructionCard } from "./InstructionCard";
import { Address } from "components/common/Address";
import { TableCell, TableRow } from "@mui/material";

export function AssociatedTokenDetailsCard({
  ix,
  index,
  result,
  innerCards,
  childIndex,
  className
}: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string
}) {
  const info = ix.parsed.info;
  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Associated Token Program: Create"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell align="right">
          <Address pubkey={ix.programId} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Account</TableCell>
        <TableCell align="right">
          <Address pubkey={new PublicKey(info.account)} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Mint</TableCell>
        <TableCell align="right">
          <Address pubkey={new PublicKey(info.mint)} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Wallet</TableCell>
        <TableCell align="right">
          <Address pubkey={new PublicKey(info.wallet)} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
