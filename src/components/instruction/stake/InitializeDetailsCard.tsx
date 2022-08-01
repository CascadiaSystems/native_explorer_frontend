import React from "react";
import {
  SignatureResult,
  StakeProgram,
  SystemProgram,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { InitializeInfo } from "./types";
import { displayTimestampUtc } from "utils/date";
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

export function InitializeDetailsCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: InitializeInfo;
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
      title="Stake Initialize"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={StakeProgram.programId} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.stakeAccount} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Stake Authority Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.authorized.staker} alignRight={matches} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Withdraw Authority Address</TableCell>
        <TableCell  align={matches?"right":"left"}>
          <Address pubkey={info.authorized.withdrawer} alignRight={matches} link />
        </TableCell>
      </TableRow>

      {info.lockup.epoch > 0 && (
        <TableRow>
          <TableCell>Lockup Expiry Epoch</TableCell>
          <TableCell  align={matches?"right":"left"}>{info.lockup.epoch}</TableCell>
        </TableRow>
      )}

      {info.lockup.unixTimestamp > 0 && (
        <TableRow>
          <TableCell>Lockup Expiry Timestamp</TableCell>
          <TableCell className="text-lg-right font-mono">
            {displayTimestampUtc(info.lockup.unixTimestamp * 1000)}
          </TableCell>
        </TableRow>
      )}

      {!info.lockup.custodian.equals(SystemProgram.programId) && (
        <TableRow>
          <TableCell>Lockup Custodian Address</TableCell>
          <TableCell  align={matches?"right":"left"}>
            <Address pubkey={info.lockup.custodian} alignRight={matches} link />
          </TableCell>
        </TableRow>
      )}
    </InstructionCard>
  );
}
