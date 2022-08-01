import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { DelegateInfo } from "./types";
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

export function DelegateDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: DelegateInfo;
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
      title="Delegate Stake"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={StakeProgram.programId} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.stakeAccount} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Delegated Vote Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.voteAccount} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.stakeAuthority} alignRight={matches} link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
