import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AdvanceNonceInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function NonceAdvanceDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AdvanceNonceInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
}) {
  const { ix, index, result, info, innerCards, childIndex, className } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Advance Nonce"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell align="right">
          <Address pubkey={SystemProgram.programId} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Nonce Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.nonceAccount} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.nonceAuthority} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
