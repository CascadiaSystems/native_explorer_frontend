import React from "react";
import { Message } from "@velas/web3";
import type { TransactionData } from "./InspectorPage";
import { useQuery } from "utils/url";
import { useHistory, useLocation } from "react-router";
import base58 from "bs58";
import ContentCard from "components/common/ContentCard";
import { TextareaAutosize, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

function deserializeTransaction(bytes: Uint8Array): {
  message: Message;
  signatures: string[];
} | null {
  const SIGNATURE_LENGTH = 64;
  const signatures = [];
  try {
    const signaturesLen = bytes[0];
    bytes = bytes.slice(1);
    for (let i = 0; i < signaturesLen; i++) {
      const rawSignature = bytes.slice(0, SIGNATURE_LENGTH);
      bytes = bytes.slice(SIGNATURE_LENGTH);
      signatures.push(base58.encode(rawSignature));
    }

    const requiredSignatures = bytes[0];
    if (requiredSignatures !== signaturesLen) {
      throw new Error("Signature length mismatch");
    }
  } catch (err) {
    // Errors above indicate that the bytes do not encode a transaction.
    return null;
  }

  const message = Message.from(bytes);
  return { message, signatures };
}

export const MIN_MESSAGE_LENGTH =
  3 + // header
  1 + // accounts length
  32 + // accounts, must have at least one address for fees
  32 + // recent blockhash
  1; // instructions length

const MIN_TRANSACTION_LENGTH =
  1 + // signatures length
  64 + // signatures, must have at least one for fees
  MIN_MESSAGE_LENGTH;

const MAX_TRANSACTION_SIGNATURES =
  Math.floor((1232 - MIN_TRANSACTION_LENGTH) / (64 + 32)) + 1;

export function RawInput({
  value,
  setTransactionData,
}: {
  value?: string;
  setTransactionData: (param: TransactionData | undefined) => void;
}) {
  const rawTransactionInput = React.useRef<HTMLTextAreaElement>(null);
  const [error, setError] = React.useState<string>();
  const [rows, setRows] = React.useState(3);
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const onInput = React.useCallback(() => {
    const base64 = rawTransactionInput.current?.value;
    if (base64) {
      // Clear url params when input is detected
      if (query.get("message")) {
        query.delete("message");
        history.push({ ...location, search: query.toString() });
      } else if (query.get("transaction")) {
        query.delete("transaction");
        history.push({ ...location, search: query.toString() });
      }

      // Dynamically expand height based on input length
      setRows(Math.max(3, Math.min(10, Math.round(base64.length / 150))));

      let buffer;
      try {
        buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      } catch (err) {
        console.error(err);
        setError("Input must be base64 encoded");
        return;
      }

      try {
        if (buffer.length < MIN_MESSAGE_LENGTH) {
          throw new Error("Input is not long enough to be valid.");
        } else if (buffer[0] > MAX_TRANSACTION_SIGNATURES) {
          throw new Error(`Input starts with invalid byte: "${buffer[0]}"`);
        }

        const tx = deserializeTransaction(buffer);
        if (tx) {
          const message = tx.message;
          const rawMessage = message.serialize();
          setTransactionData({
            rawMessage,
            message,
            signatures: tx.signatures,
          });
        } else {
          const message = Message.from(buffer);
          setTransactionData({
            rawMessage: buffer,
            message,
          });
        }

        setError(undefined);
        return;
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    } else {
      setError(undefined);
    }
  }, [setTransactionData, history, query, location]);

  React.useEffect(() => {
    const input = rawTransactionInput.current;
    if (input && value) {
      input.value = value;
      onInput();
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const placeholder = "Paste raw base64 encoded transaction message";
  return (
    <ContentCard
      title={<Typography variant="h3">Encoded Transaction Message</Typography>}
      footer={(
        <div>
          <Typography className="pb-4">Instructions</Typography>
          <ul className="pl-4">
            <li className="mb-4">
              <strong>CLI: </strong>Use <code className="bg-grey-dark p-1 text-secondary">--dump-transaction-message</code>{" "}
              flag
            </li>
            <li className="mb-4">
              <strong>Rust: </strong>Add <code className="bg-grey-dark p-1 text-secondary">base64</code> crate dependency and{" "}
              <code className="bg-grey-dark p-1 text-secondary">
                println!("{}", base64::encode(&transaction.message_data()));
              </code>
            </li>
            <li>
              <strong>JavaScript: </strong>Add{" "}
              <code className="bg-grey-dark p-1 text-secondary">console.log(tx.serializeMessage().toString("base64"));</code>
            </li>
          </ul>
        </div>
      )}
    >
      <div className="p-4 bg-grey-light">
        <TextareaAutosize
          minRows={rows}
          onInput={onInput}
          ref={rawTransactionInput}
          placeholder={placeholder}
          className="font-mono w-full bg-grey-light resize-none focus:outline-none"
        />
        {error && (
          <Typography variant="body2" color="secondary" className="pt-2">
            <FontAwesomeIcon icon={faCircleXmark} /> {error}
          </Typography>
        )}
      </div>

    </ContentCard>
  );
}
