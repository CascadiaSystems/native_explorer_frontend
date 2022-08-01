import React from "react";
import { PublicKey } from "@velas/web3";
import { create, Struct } from "superstruct";
import { ParsedInfo } from "validators";
import {
  UpdateCommissionInfo,
  UpdateValidatorInfo,
  VoteInfo,
  VoteSwitchInfo,
  WithdrawInfo,
  AuthorizeInfo,
} from "./types";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { displayTimestamp } from "utils/date";
import { UnknownDetailsCard } from "../UnknownDetailsCard";
import { InstructionDetailsProps } from "components/transaction/InstructionsSection";
import { camelToTitleCase } from "utils";
import { useCluster } from "providers/cluster";
import { reportError } from "utils/sentry";
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

export function VoteDetailsCard(props: InstructionDetailsProps) {
  const { url } = useCluster();

  try {
    const parsed = create(props.ix.parsed, ParsedInfo);

    switch (parsed.type) {
      case "vote":
        return RenderDetails<VoteInfo>(props, parsed, VoteInfo);
      case "authorize":
        return RenderDetails<AuthorizeInfo>(props, parsed, AuthorizeInfo);
      case "withdraw":
        return RenderDetails<WithdrawInfo>(props, parsed, WithdrawInfo);
      case "updateValidator":
        return RenderDetails<UpdateValidatorInfo>(
          props,
          parsed,
          UpdateValidatorInfo
        );
      case "updateCommission":
        return RenderDetails<UpdateCommissionInfo>(
          props,
          parsed,
          UpdateCommissionInfo
        );
      case "voteSwitch":
        return RenderDetails<VoteSwitchInfo>(props, parsed, VoteSwitchInfo);
    }
  } catch (error) {
    reportError(error, {
      url,
    });
  }

  return <UnknownDetailsCard {...props} />;
}

function RenderDetails<T>(
  props: InstructionDetailsProps,
  parsed: ParsedInfo,
  struct: Struct<T>
) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const info = create(parsed.info, struct);
  const attributes: JSX.Element[] = [];

  for (let [key, value] of Object.entries(info)) {
    if (value instanceof PublicKey) {
      value = <Address pubkey={value} alignRight={matches} link />;
    }

    if (key === "vote") {
      attributes.push(
        <TableRow key="vote-hash">
          <TableCell>Vote Hash</TableCell>
          <TableCell  align={matches?"right":"left"}>
            <pre className="inline-block text-left p-2 bg-grey-dark">{value.hash}</pre>
          </TableCell>
        </TableRow>
      );

      if (value.timestamp) {
        attributes.push(
          <TableRow key="timestamp">
            <TableCell>Timestamp</TableCell>
            <TableCell  align={matches?"right":"left"}>
              {displayTimestamp(value.timestamp * 1000)}
            </TableCell>
          </TableRow>
        );
      }

      attributes.push(
        <TableRow key="vote-slots">
          <TableCell>Slots</TableCell>
          <TableCell  align={matches?"right":"left"}>
            <pre className="inline-block p-2 bg-grey-dark text-left">
              {value.slots.join("\n")}
            </pre>
          </TableCell>
        </TableRow>
      );
    } else {
      attributes.push(
        <TableRow key={key}>
          <TableCell>{camelToTitleCase(key)} </TableCell>
          <TableCell  align={matches?"right":"left"}>{value}</TableCell>
        </TableRow>
      );
    }
  }

  return (
    <InstructionCard
      {...props}
      title={`Vote: ${camelToTitleCase(parsed.type)}`}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell className="text-lg-right">
          <Address pubkey={props.ix.programId} alignRight={matches} link />
        </TableCell>
      </TableRow>
      {attributes}
    </InstructionCard>
  );
}
