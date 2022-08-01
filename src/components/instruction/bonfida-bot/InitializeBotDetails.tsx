import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { InitializeBot } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function InitializeBotDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: InitializeBot;
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
      title="Bonfida Bot: Initialize Bot"
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
        <td>Pool Account</td>
        <td className="text-lg-right">
          <Address pubkey={info.poolAccount} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Mint Account</td>
        <td className="text-lg-right">
          <Address pubkey={info.mintAccount} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Pool Seed</td>
        <td className="text-lg-right">{info.poolSeed}</td>
      </tr>

      <tr>
        <td>Max Number of Assets</td>
        <td className="text-lg-right">{info.maxNumberOfAsset}</td>
      </tr>

      <tr>
        <td>Number of Markets</td>
        <td className="text-lg-right">{info.numberOfMarkets}</td>
      </tr>
    </InstructionCard>
  );
}
