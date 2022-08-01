import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { MergeInfo } from "./types";
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

export function MergeDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: MergeInfo;
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
      title="Stake Merge"
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
        <TableCell>Stake Source</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.source} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Destination</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.destination} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.stakeAuthority} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Clock Sysvar</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.clockSysvar} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake History Sysvar</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.stakeHistorySysvar} alignRight={matches} link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
