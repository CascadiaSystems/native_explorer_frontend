import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AssignInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function AssignDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AssignInfo;
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
      title="Assign Account"
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
        <TableCell>Account Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.account} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Assigned Owner</TableCell>
        <TableCell align="right">
          <Address pubkey={info.owner} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
