import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { CancelOrderByClientId } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function CancelOrderByClientIdDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: CancelOrderByClientId;
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
      title="Serum: Cancel Order By Client Id"
      innerCards={innerCards}
      childIndex={childIndex}
    >
      <tr>
        <td>Market</td>
        <td className="text-lg-right">
          <Address pubkey={info.market} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Open Orders</td>
        <td className="text-lg-right">
          <Address pubkey={info.openOrders} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Request Queue</td>
        <td className="text-lg-right">
          <Address pubkey={info.requestQueue} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Owner</td>
        <td className="text-lg-right">
          <Address pubkey={info.owner} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Client Id</td>
        <td className="text-lg-right">{info.clientId.toString(10)}</td>
      </tr>
    </InstructionCard>
  );
}
