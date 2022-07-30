import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { DelegateInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function DelegateDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: DelegateInfo;
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
      title="Delegate Stake"
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
        <TableCell>Stake Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.stakeAccount} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Delegated Vote Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.voteAccount} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.stakeAuthority} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
