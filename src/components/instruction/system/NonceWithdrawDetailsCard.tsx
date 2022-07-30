import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { SolBalance } from "utils";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { WithdrawNonceInfo } from "./types";
import { TableCell, TableRow } from "@mui/material";

export function NonceWithdrawDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: WithdrawNonceInfo;
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
      title="Withdraw Nonce"
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
        <TableCell>Authority Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.nonceAuthority} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>To Address</TableCell>
        <TableCell align="right">
          <Address pubkey={info.destination} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Withdraw Amount (VLX)</TableCell>
        <TableCell align="right">
          <SolBalance lamports={info.lamports} />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
