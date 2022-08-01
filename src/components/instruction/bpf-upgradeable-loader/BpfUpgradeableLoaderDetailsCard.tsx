import React from "react";
import {
  ParsedTransaction,
  ParsedInstruction,
  SignatureResult,
  PublicKey,
} from "@velas/web3";
import { Address } from "components/common/Address";
import { create, Struct } from "superstruct";
import { camelToTitleCase } from "utils";
import { reportError } from "utils/sentry";
import { ParsedInfo } from "validators";
import { InstructionCard } from "../InstructionCard";
import { UnknownDetailsCard } from "../UnknownDetailsCard";
import {
  DeployWithMaxDataLenInfo,
  InitializeBufferInfo,
  SetAuthorityInfo,
  UpgradeInfo,
  WriteInfo,
} from "./types";
import { TableCell, TableRow, useMediaQuery, useTheme } from "@mui/material";

type DetailsProps = {
  tx: ParsedTransaction;
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
};

export function BpfUpgradeableLoaderDetailsCard(props: DetailsProps) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  function renderDetails<T>(
    props: DetailsProps,
    parsed: ParsedInfo,
    struct: Struct<T>
  ) {
    const info = create(parsed.info, struct);
  
    const attributes: JSX.Element[] = [];
    for (let [key, value] of Object.entries(info)) {
      if (value instanceof PublicKey) {
        value = <Address pubkey={value} alignRight={matches} link />;
      } else if (key === "bytes") {
        value = (
          <pre className="inline-block text-left bg-grey-dark p-2">{value}</pre>
        );
      }
  
      attributes.push(
        <TableRow key={key}>
          <TableCell>
            {camelToTitleCase(key)}{" "}
            {key === "bytes" && <span className="text-muted">(Base 64)</span>}
          </TableCell>
          <TableCell  align={matches?"right":"left"}>{value}</TableCell>
        </TableRow>
      );
    }
  
    return (
      <InstructionCard
        {...props}
        title={`BPF Upgradeable Loader: ${camelToTitleCase(parsed.type)}`}
      >
        <TableRow>
          <TableCell>Program</TableCell>
          <TableCell  align={matches?"right":"left"}>
            <Address pubkey={props.ix.programId} alignRight={matches} link />
          </TableCell>
        </TableRow>
        {attributes}
      </InstructionCard>
    );
  }
  
  try {
    const parsed = create(props.ix.parsed, ParsedInfo);
    switch (parsed.type) {
      case "write": {
        return renderDetails<WriteInfo>(props, parsed, WriteInfo);
      }
      case "upgrade": {
        return renderDetails<UpgradeInfo>(props, parsed, UpgradeInfo);
      }
      case "setAuthority": {
        return renderDetails<SetAuthorityInfo>(props, parsed, SetAuthorityInfo);
      }
      case "deployWithMaxDataLen": {
        return renderDetails<DeployWithMaxDataLenInfo>(
          props,
          parsed,
          DeployWithMaxDataLenInfo
        );
      }
      case "initializeBuffer": {
        return renderDetails<InitializeBufferInfo>(
          props,
          parsed,
          InitializeBufferInfo
        );
      }
      default:
        return <UnknownDetailsCard {...props} />;
    }
  } catch (error) {
    reportError(error, {
      signature: props.tx.signatures[0],
    });
    return <UnknownDetailsCard {...props} />;
  }
}

