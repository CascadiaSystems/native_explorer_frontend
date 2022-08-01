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
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

export function TransferWithSeedDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: TransferWithSeedInfo;
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
      title="Transfer w/ Seed"
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
        <TableCell>From Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.source} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Destination Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.destination} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Base Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.sourceBase} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Transfer Amount (VLX)</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <SolBalance lamports={info.lamports} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Seed</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Copyable text={info.sourceSeed}>
            <code>{info.sourceSeed}</code>
          </Copyable>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Source Owner</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.sourceOwner} alignRight={matches} link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
