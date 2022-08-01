import React from "react";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { SettleFunds } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";

export function SettleFundsDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  info: SettleFunds;
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
      title="Serum: Settle Funds"
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
        <td>Open Orders</td>
        <td className="text-lg-right">
          <Address pubkey={info.openOrders} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Owner</td>
        <td className="text-lg-right">
          <Address pubkey={info.owner} alignRight={matches} link />
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
        <td>Base Wallet</td>
        <td className="text-lg-right">
          <Address pubkey={info.baseWallet} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Quote Wallet</td>
        <td className="text-lg-right">
          <Address pubkey={info.quoteWallet} alignRight={matches} link />
        </td>
      </tr>

      <tr>
        <td>Vault Signer</td>
        <td className="text-lg-right">
          <Address pubkey={info.vaultSigner} alignRight={matches} link />
        </td>
      </tr>

      {info.referrerQuoteWallet && (
        <tr>
          <td>Referrer Quote Wallet</td>
          <td className="text-lg-right">
            <Address pubkey={info.referrerQuoteWallet} alignRight={matches} link />
          </td>
        </tr>
      )}
    </InstructionCard>
  );
}
