import React from "react";
import {
  SignatureResult,
  ParsedInstruction,
  ParsedTransaction,
  BPF_LOADER_PROGRAM_ID,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { create } from "superstruct";
import { ParsedInfo } from "validators";
import { WriteInfo, FinalizeInfo } from "./types";
import { reportError } from "utils/sentry";
import { UnknownDetailsCard } from "../UnknownDetailsCard";
import { Address } from "components/common/Address";
import { wrap } from "utils";
import { TableCell, TableRow, useTheme, useMediaQuery } from "@mui/material";

type DetailsProps = {
  tx: ParsedTransaction;
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
};

export function BpfLoaderDetailsCard(props: DetailsProps) {
  try {
    const parsed = create(props.ix.parsed, ParsedInfo);

    switch (parsed.type) {
      case "write": {
        const info = create(parsed.info, WriteInfo);
        return <BpfLoaderWriteDetailsCard info={info} {...props} />;
      }
      case "finalize": {
        const info = create(parsed.info, FinalizeInfo);
        return <BpfLoaderFinalizeDetailsCard info={info} {...props} />;
      }
      default:
        return <UnknownDetailsCard {...props} />;
    }
  } catch (error) {
    reportError(error, {
      signature: props.tx.signatures[0],
    });
    return <UnknownDetailsCard {...props} />;
  }
}

type Props<T> = {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: T;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
};

export function BpfLoaderWriteDetailsCard(props: Props<WriteInfo>) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { ix, index, result, info, innerCards, childIndex, className } = props;
  const bytes = wrap(info.bytes, 50);
  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="BPF Loader 2: Write"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={BPF_LOADER_PROGRAM_ID} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Account</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.account} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          Bytes <span className="text-muted">(Base 64)</span>
        </TableCell>
        <TableCell  align={matches?"right":"left"}>
          <pre className="inline-block text-left p-2 bg-grey-dark">{bytes}</pre>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Offset</TableCell>
        <TableCell  align={matches?"right":"left"}>{info.offset}</TableCell>
      </TableRow>
    </InstructionCard>
  );
}

export function BpfLoaderFinalizeDetailsCard(props: Props<FinalizeInfo>) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="BPF Loader 2: Finalize"
      innerCards={innerCards}
      childIndex={childIndex}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={BPF_LOADER_PROGRAM_ID} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Account</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.account} alignRight={matches} link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
