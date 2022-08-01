import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { CancelOrder } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function CancelOrderDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: CancelOrder;
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
      title="Serum: Cancel Order"
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
        <td>Signal Provider Address</td>
        <td className="text-lg-right">
          <Address pubkey={info.signalProviderKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Open Orders</td>
        <td className="text-lg-right">
          <Address pubkey={info.openOrdersKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Serum Event Queue</td>
        <td className="text-lg-right">
          <Address pubkey={info.serumEventQueue} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Serum Bids</td>
        <td className="text-lg-right">
          <Address pubkey={info.serumMarketBids} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Serum Asks</td>
        <td className="text-lg-right">
          <Address pubkey={info.serumMarketAsks} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Bot Address</td>
        <td className="text-lg-right">
          <Address pubkey={info.poolKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Serum Program ID</td>
        <td className="text-lg-right">
          <Address pubkey={info.dexProgramKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Pool Seed</td>
        <td className="text-lg-right">{info.poolSeed}</td>
      </tr>

      <tr>
        <td>Side</td>
        <td className="text-lg-right">{info.side}</td>
      </tr>

      <tr>
        <td>Order Id</td>
        <td className="text-lg-right">{info.orderId.toString(10)}</td>
      </tr>
    </InstructionCard>
  );
}
