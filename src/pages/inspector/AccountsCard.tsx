import React from "react";
import { Message, PublicKey } from "@velas/web3";
import { TableCardBody } from "components/common/TableCardBody";
import { AddressWithContext } from "./AddressWithContext";
import { ErrorCard } from "components/common/ErrorCard";
import { Chip, TableCell, TableRow, Typography, Button, TableContainer, TableBody, Table } from "@mui/material";
import ContentCard from "components/common/ContentCard";

export function AccountsCard({ message, className }: { message: Message, className?: string }) {
  const [expanded, setExpanded] = React.useState(true);

  const { validMessage, error } = React.useMemo(() => {
    const {
      numRequiredSignatures,
      numReadonlySignedAccounts,
      numReadonlyUnsignedAccounts,
    } = message.header;

    if (numReadonlySignedAccounts >= numRequiredSignatures) {
      return { validMessage: undefined, error: "Invalid header" };
    } else if (numReadonlyUnsignedAccounts >= message.accountKeys.length) {
      return { validMessage: undefined, error: "Invalid header" };
    } else if (message.accountKeys.length === 0) {
      return { validMessage: undefined, error: "Message has no accounts" };
    }

    return {
      validMessage: message,
      error: undefined,
    };
  }, [message]);

  const accountRows = React.useMemo(() => {
    const message = validMessage;
    if (!message) return;
    return message.accountKeys.map((publicKey, accountIndex) => {
      const {
        numRequiredSignatures,
        numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts,
      } = message.header;

      let readOnly = false;
      let signer = false;
      if (accountIndex < numRequiredSignatures) {
        signer = true;
        if (accountIndex >= numRequiredSignatures - numReadonlySignedAccounts) {
          readOnly = true;
        }
      } else if (
        accountIndex >=
        message.accountKeys.length - numReadonlyUnsignedAccounts
      ) {
        readOnly = true;
      }

      const props = {
        accountIndex,
        publicKey,
        signer,
        readOnly,
      };

      return <AccountRow key={accountIndex} {...props} />;
    });
  }, [validMessage]);

  if (error) {
    return <ErrorCard text={`Unable to display accounts. ${error}`} />;
  }

  return (
    <ContentCard
      title={<Typography variant="h3">{`Account List (${message.accountKeys.length})`}</Typography>}
      action={(
        <Button variant="outlined" size="small"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
      )}
      className={className}
    >
      {expanded && (
        <TableContainer>
          <Table>
            <TableBody>
              {accountRows}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ContentCard>
  );
}

function AccountRow({
  accountIndex,
  publicKey,
  signer,
  readOnly,
}: {
  accountIndex: number;
  publicKey: PublicKey;
  signer: boolean;
  readOnly: boolean;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-2">
          Account #{accountIndex + 1}
          <div className="flex items-center gap-2">
            {signer && (
              <Chip label="Signer" variant="filled" size="small" /> 
              )}
            {!readOnly && (
              <Chip label="Writable" variant="filled" size="small" /> 
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-lg-right">
        <AddressWithContext pubkey={publicKey} />
      </TableCell>
    </TableRow>
  );
}
