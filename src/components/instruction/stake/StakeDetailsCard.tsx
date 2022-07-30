import React from "react";
import {
  SignatureResult,
  ParsedTransaction,
  ParsedInstruction,
} from "@velas/web3";

import { UnknownDetailsCard } from "../UnknownDetailsCard";
import { InitializeDetailsCard } from "./InitializeDetailsCard";
import { DelegateDetailsCard } from "./DelegateDetailsCard";
import { AuthorizeDetailsCard } from "./AuthorizeDetailsCard";
import { SplitDetailsCard } from "./SplitDetailsCard";
import { WithdrawDetailsCard } from "./WithdrawDetailsCard";
import { DeactivateDetailsCard } from "./DeactivateDetailsCard";
import { ParsedInfo } from "validators";
import { reportError } from "utils/sentry";
import { create } from "superstruct";
import {
  AuthorizeInfo,
  DeactivateInfo,
  DelegateInfo,
  InitializeInfo,
  MergeInfo,
  SplitInfo,
  WithdrawInfo,
} from "./types";
import { MergeDetailsCard } from "./MergeDetailsCard";

type DetailsProps = {
  tx: ParsedTransaction;
  ix: ParsedInstruction;
  result: SignatureResult;
  index: number;
  innerCards?: JSX.Element[];
  childIndex?: number;
};

export function StakeDetailsCard(props: DetailsProps) {
  try {
    const parsed = create(props.ix.parsed, ParsedInfo);

    switch (parsed.type) {
      case "initialize": {
        const info = create(parsed.info, InitializeInfo);
        return <InitializeDetailsCard info={info} {...props} className="mt-6" />;
      }
      case "delegate": {
        const info = create(parsed.info, DelegateInfo);
        return <DelegateDetailsCard info={info} {...props} className="mt-6" />;
      }
      case "authorize": {
        const info = create(parsed.info, AuthorizeInfo);
        return <AuthorizeDetailsCard info={info} {...props} className="mt-6" />;
      }
      case "split": {
        const info = create(parsed.info, SplitInfo);
        return <SplitDetailsCard info={info} {...props} className="mt-6" />;
      }
      case "withdraw": {
        const info = create(parsed.info, WithdrawInfo);
        return <WithdrawDetailsCard info={info} {...props} className="mt-6" />;
      }
      case "deactivate": {
        const info = create(parsed.info, DeactivateInfo);
        return <DeactivateDetailsCard info={info} {...props} className="mt-6" />;
      }
      case "merge": {
        const info = create(parsed.info, MergeInfo);
        return <MergeDetailsCard info={info} {...props} className="mt-6" />;
      }
      default:
        return <UnknownDetailsCard {...props} className="mt-6" />;
    }
  } catch (error) {
    reportError(error, {
      signature: props.tx.signatures[0],
    });
    return <UnknownDetailsCard {...props} />;
  }
}
