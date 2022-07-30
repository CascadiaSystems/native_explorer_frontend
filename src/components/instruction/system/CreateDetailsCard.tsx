import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { SolBalance } from "utils";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { CreateAccountInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function CreateDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: CreateAccountInfo;
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
      title="Create Account"
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
        <TableCell>From Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.source} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>New Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.newAccount} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Transfer Amount (VLX)</TableCell>
        <TableCell align="right">
          <SolBalance lamports={info.lamports} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Allocated Space (Bytes)</TableCell>
        <TableCell align="right">{info.space}</TableCell>
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
