import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AuthorizeNonceInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function NonceAuthorizeDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AuthorizeNonceInfo;
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
      title="Authorize Nonce"
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
        <TableCell>Nonce Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.nonceAccount} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Old Authority Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.nonceAuthority} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>New Authority Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.newAuthorized} alignRight link />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
