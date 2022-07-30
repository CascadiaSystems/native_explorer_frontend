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
import { TableCell, TableRow } from "@mui/material";

export function VoteDetailsCard(props: InstructionDetailsProps) {
  const { url } = useCluster();

  try {
    const parsed = create(props.ix.parsed, ParsedInfo);

    switch (parsed.type) {
      case "vote":
        return renderDetails<VoteInfo>(props, parsed, VoteInfo);
      case "authorize":
        return renderDetails<AuthorizeInfo>(props, parsed, AuthorizeInfo);
      case "withdraw":
        return renderDetails<WithdrawInfo>(props, parsed, WithdrawInfo);
      case "updateValidator":
        return renderDetails<UpdateValidatorInfo>(
          props,
          parsed,
          UpdateValidatorInfo
        );
      case "updateCommission":
        return renderDetails<UpdateCommissionInfo>(
          props,
          parsed,
          UpdateCommissionInfo
        );
      case "voteSwitch":
        return renderDetails<VoteSwitchInfo>(props, parsed, VoteSwitchInfo);
    }
  } catch (error) {
    reportError(error, {
      url,
    });
  }

  return <UnknownDetailsCard {...props} />;
}

function renderDetails<T>(
  props: InstructionDetailsProps,
  parsed: ParsedInfo,
  struct: Struct<T>
) {
  const info = create(parsed.info, struct);
  const attributes: JSX.Element[] = [];

  for (let [key, value] of Object.entries(info)) {
    if (value instanceof PublicKey) {
      value = <Address pubkey={value} alignRight link />;
    }

    if (key === "vote") {
      attributes.push(
        <TableRow key="vote-hash">
          <TableCell>Vote Hash</TableCell>
          <TableCell align="right">
            {value.hash}
            {/* <pre className="d-inline-block text-left mb-0">{value.hash}</pre> */}
          </TableCell>
        </TableRow>
      );

      if (value.timestamp) {
        attributes.push(
          <TableRow key="timestamp">
            <TableCell>Timestamp</TableCell>
            <TableCell align="right">
              {displayTimestamp(value.timestamp * 1000)}
            </TableCell>
          </TableRow>
        );
      }

      attributes.push(
        <TableRow key="vote-slots">
          <TableCell>Slots</TableCell>
          <TableCell align="right">
            {value.slots.join("\n")}
            {/* <pre className="d-inline-block text-left mb-0">
            </pre> */}
          </TableCell>
        </TableRow>
      );
    } else {
      attributes.push(
        <TableRow key={key}>
          <TableCell>{camelToTitleCase(key)} </TableCell>
          <TableCell align="right">{value}</TableCell>
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
          <Address pubkey={props.ix.programId} alignRight link />
        </TableCell>
      </TableRow>
      {attributes}
    </InstructionCard>
  );
}
