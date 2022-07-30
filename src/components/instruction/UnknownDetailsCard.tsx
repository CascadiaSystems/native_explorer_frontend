import React from "react";
import {
  TransactionInstruction,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { InstructionCard } from "./InstructionCard";

export function UnknownDetailsCard({
  ix,
  index,
  result,
  innerCards,
  childIndex,
  className
}: {
  ix: TransactionInstruction | ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string
}) {
  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Unknown"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
      defaultRaw
    />
  );
}
