import React from "react";
import { Link } from "react-router-dom";
import { TransactionSignature } from "@velas/web3";
import { clusterPath } from "utils/url";
import { Copyable } from "./Copyable";
import { Typography } from "@mui/material";

type Props = {
  signature: TransactionSignature;
  alignRight?: boolean;
  link?: boolean;
  truncate?: boolean;
  truncateChars?: number;
};

export function Signature({
  signature,
  alignRight,
  link,
  truncate,
  truncateChars,
}: Props) {
  let signatureLabel = signature;

  if (truncateChars) {
    signatureLabel = signature.slice(0, truncateChars) + "…";
  }

  return (
    <div
      className={`d-flex align-items-center ${
        alignRight ? "justify-content-end" : ""
      }`}
    >
      <Copyable text={signature} replaceText={!alignRight}>
        <Typography color="secondary" className="hover:text-primary">
          {link ? (
            <Link
              className={truncate ? "text-truncate signature-truncate" : ""}
              to={clusterPath(`/tx/${signature}`)}
            >
              {signatureLabel}
            </Link>
          ) : (
            signatureLabel
          )}
        </Typography>
      </Copyable>
    </div>
  );
}
