import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { MatchOrders } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function MatchOrdersDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: MatchOrders;
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
      title="Serum: Match Orders"
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
        <td>Request Queue</td>
        <td className="text-lg-right">
          <Address pubkey={info.requestQueue} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Event Queue</td>
        <td className="text-lg-right">
          <Address pubkey={info.eventQueue} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Bids</td>
        <td className="text-lg-right">
          <Address pubkey={info.bids} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Asks</td>
        <td className="text-lg-right">
          <Address pubkey={info.asks} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Base Vault</td>
        <td className="text-lg-right">
          <Address pubkey={info.baseVault} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Quote Vault</td>
        <td className="text-lg-right">
          <Address pubkey={info.quoteVault} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Limit</td>
        <td className="text-lg-right">{info.limit}</td>
      </tr>
    </InstructionCard>
  );
}
