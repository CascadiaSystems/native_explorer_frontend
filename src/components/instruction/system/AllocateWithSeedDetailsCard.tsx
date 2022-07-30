import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Copyable } from "components/common/Copyable";
import { Address } from "components/common/Address";
import { AllocateWithSeedInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function AllocateWithSeedDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AllocateWithSeedInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string
}) {
  const { ix, index, result, info, innerCards, childIndex, className } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Allocate Account w/ Seed"
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
        <TableCell>Base Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.base} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Seed</TableCell>
        <TableCell align="right">
          <Copyable text={info.seed}>
            <code>{info.seed}</code>
          </Copyable>
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
