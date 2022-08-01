import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AllocateInfo } from "./types";
import { TableCell, TableRow, useTheme, useMediaQuery } from "@mui/material";

export function AllocateDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AllocateInfo;
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
      title="Allocate Account"
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
        <TableCell>Account Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.account} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Allocated Space (Bytes)</TableCell>
        <TableCell  align={matches?"right":"left"}>{info.space}</TableCell>
      </TableRow>
    </InstructionCard>
  );
}
