import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { CreateBot } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function CreateBotDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: CreateBot;
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
      title="Bonfida Bot: Create Bot"
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
        <td>Bot Token Mint</td>
        <td className="text-lg-right">
          <Address pubkey={info.mintKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Bot Address</td>
        <td className="text-lg-right">
          <Address pubkey={info.poolKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Target Pool Token Address</td>
        <td className="text-lg-right">
          <Address pubkey={info.targetPoolTokenKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Serum Program ID</td>
        <td className="text-lg-right">
          <Address pubkey={info.serumProgramId} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Signal Provider Address</td>
        <td className="text-lg-right">
          <Address pubkey={info.signalProviderKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Pool Seed</td>
        <td className="text-lg-right">{info.poolSeed}</td>
      </tr>

      <tr>
        <td>Fee Ratio</td>
        <td className="text-lg-right">{info.feeRatio}</td>
      </tr>

      <tr>
        <td>Fee Collection Period</td>
        <td className="text-lg-right">{info.feeCollectionPeriod}</td>
      </tr>

      <tr>
        <td>Serum Markets</td>
        <td className="text-lg-right">{info.markets}</td>
      </tr>

      <tr>
        <td>Deposit Amounts</td>
        <td className="text-lg-right">{info.depositAmounts}</td>
      </tr>
    </InstructionCard>
  );
}
