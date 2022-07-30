import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { MergeInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function MergeDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: MergeInfo;
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
      title="Stake Merge"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell align="right">
          <Address pubkey={StakeProgram.programId} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Source</TableCell>
        <TableCell align="right">
          <Address pubkey={info.source} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Destination</TableCell>
        <TableCell align="right">
          <Address pubkey={info.destination} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.stakeAuthority} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Clock Sysvar</TableCell>
        <TableCell align="right">
          <Address pubkey={info.clockSysvar} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake History Sysvar</TableCell>
        <TableCell align="right">
          <Address pubkey={info.stakeHistorySysvar} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
