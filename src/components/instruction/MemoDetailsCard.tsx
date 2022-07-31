import React from "react";
import { ParsedInstruction, SignatureResult } from "@velas/web3";
import { InstructionCard } from "./InstructionCard";
import { wrap } from "utils";
import { Address } from "components/common/Address";
import { TableCell, TableRow } from "@mui/material";

export function MemoDetailsCard({
  ix,
  index,
  result,
  innerCards,
  childIndex,
  className
}: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
}) {
  const data = wrap(ix.parsed, 50);
  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Memo"
      innerCards={innerCards}
      childIndex={childIndex}
      className={className}
    >
      <TableRow>
        <TableCell>Program</TableCell>
        <TableCell className="text-lg-right">
          <Address pubkey={ix.programId} alignRight link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Data (UTF-8)</TableCell>
        <TableCell className="text-lg-right">
          <pre className="inline-block p-2 bg-grey-dark text-left">{data}</pre>
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
