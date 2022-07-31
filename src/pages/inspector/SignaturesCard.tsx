import React from "react";
import bs58 from "bs58";
import * as nacl from "tweetnacl";
import { Message, PublicKey } from "@velas/web3";
import { Signature } from "components/common/Signature";
import { Address } from "components/common/Address";
import ContentCard from "components/common/ContentCard";
import { TableContainer, Table, TableHead, Typography, TableRow, TableCell, TableBody } from "@mui/material";

export function TransactionSignatures({
  signatures,
  message,
  rawMessage,
  className,
}: {
  signatures: (string | null)[];
  message: Message;
  rawMessage: Uint8Array;
  className?: string;
}) {
  const signatureRows = React.useMemo(() => {
    return signatures.map((signature, index) => {
      const publicKey = message.accountKeys[index];

      let verified;
      if (signature) {
        const key = publicKey.toBytes();
        const rawSignature = bs58.decode(signature);
        verified = verifySignature({
          message: rawMessage,
          signature: rawSignature,
          key,
        });
      }

      const props = {
        index,
        signature,
        signer: publicKey,
        verified,
      };

      return <SignatureRow key={publicKey.toBase58()} {...props} />;
    });
  }, [signatures, message, rawMessage]);

  return (
    <ContentCard
      title={<Typography variant="h3">Signatures</Typography>}
      className={className}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Signature</TableCell>
              <TableCell>Signer</TableCell>
              <TableCell align="right">Validity</TableCell>
              <TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signatureRows}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

function verifySignature({
  message,
  signature,
  key,
}: {
  message: Uint8Array;
  signature: Uint8Array;
  key: Uint8Array;
}): boolean {
  return nacl.sign.detached.verify(message, signature, key);
}

function SignatureRow({
  signature,
  signer,
  verified,
  index,
}: {
  signature: string | null;
  signer: PublicKey;
  verified?: boolean;
  index: number;
}) {
  return (
    <TableRow>
      <TableCell>
        {/* <span className="badge badge-soft-info mr-1">{index + 1}</span> */}
        {index + 1}
      </TableCell>
      <TableCell>
        {signature ? (
          <Signature signature={signature} truncateChars={40} />
        ) : (
          "Missing Signature"
        )}
      </TableCell>
      <TableCell>
        <Address pubkey={signer} link />
      </TableCell>
      <TableCell align="right">
        {verified === undefined ? (
          "N/A"
        ) : verified ? (
          <span className="badge badge-soft-success mr-1">Valid</span>
        ) : (
          <span className="badge badge-soft-warning mr-1">Invalid</span>
        )}
      </TableCell>
      <TableCell align="right">
        {index === 0 && (
          <span className="badge badge-soft-info mr-1">Fee Payer</span>
        )}
      </TableCell>
    </TableRow>
  );
}
