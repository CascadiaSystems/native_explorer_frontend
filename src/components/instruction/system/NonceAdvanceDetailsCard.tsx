import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AdvanceNonceInfo } from "./types";
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

export function NonceAdvanceDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AdvanceNonceInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
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
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={SystemProgram.programId} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Nonce Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.nonceAccount} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.nonceAuthority} alignRight={matches} link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
