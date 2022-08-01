import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { CollectFees } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function CollectFeesDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: CollectFees;
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
      title="Bonfida Bot: Collect Fees"
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
        <td>Signal Provider</td>
        <td className="text-lg-right">
          <Address pubkey={info.signalProviderPoolTokenKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Insurance Fund</td>
        <td className="text-lg-right">
          <Address pubkey={info.bonfidaFeePoolTokenKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Buy and Burn</td>
        <td className="text-lg-right">
          <Address pubkey={info.bonfidaBnBPTKey} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Pool Seed</td>
        <td className="text-lg-right">{info.poolSeed}</td>
      </tr>
    </InstructionCard>
  );
}
