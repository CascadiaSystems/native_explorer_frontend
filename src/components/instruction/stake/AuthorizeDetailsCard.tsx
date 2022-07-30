import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AuthorizeInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function AuthorizeDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AuthorizeInfo;
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
      title="Stake Authorize"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell className="text-lg-right">
          <Address pubkey={StakeProgram.programId} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Address</TableCell>
        <TableCell className="text-lg-right">
          <Address pubkey={info.stakeAccount} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Old Authority Address</TableCell>
        <TableCell className="text-lg-right">
          <Address pubkey={info.authority} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>New Authority Address</TableCell>
        <TableCell className="text-lg-right">
          <Address pubkey={info.newAuthority} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Authority Type</TableCell>
        <TableCell className="text-lg-right">{info.authorityType}</TableCell>
      </TableRow>
    </InstructionCard>
  );
}
