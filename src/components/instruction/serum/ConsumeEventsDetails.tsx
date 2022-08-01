import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { ConsumeEvents } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function ConsumeEventsDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: ConsumeEvents;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Serum: Consume Events"
      innerCards={innerCards}
      childIndex={childIndex}
    >
      <tr>
        <td>Program</td>
        <td className="text-lg-right">
          <Address pubkey={info.programId} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Market</td>
        <td className="text-lg-right">
          <Address pubkey={info.market} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Event Queue</td>
        <td className="text-lg-right">
          <Address pubkey={info.eventQueue} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Open Orders Accounts</td>
        <td className="text-lg-right">
          {info.openOrdersAccounts.map((account, index) => {
            return <Address pubkey={account} key={index} alignRight={matches} link />;
          })}
        </td>
      </tr>

      <tr>
        <td>Limit</td>
        <td className="text-lg-right">{info.limit}</td>
      </tr>
    </InstructionCard>
  );
}
