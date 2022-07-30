import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { SolBalance } from "utils";
import { InstructionCard } from "../InstructionCard";
import { Copyable } from "components/common/Copyable";
import { Address } from "components/common/Address";
import { TransferWithSeedInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function TransferWithSeedDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: TransferWithSeedInfo;
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
      title="Transfer w/ Seed"
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
        <TableCell>Destination Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.destination} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Base Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.sourceBase} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Transfer Amount (VLX)</TableCell>
        <TableCell align="right">
          <SolBalance lamports={info.lamports} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Seed</TableCell>
        <TableCell align="right">
          <Copyable text={info.sourceSeed}>
            <code>{info.sourceSeed}</code>
          </Copyable>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Source Owner</TableCell>
        <TableCell align="right">
          <Address pubkey={info.sourceOwner} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
