import React, { useContext } from "react";
import {
  TransactionInstruction,
  SignatureResult,
  ParsedInstruction,
} from "@velas/web3";
import { RawDetails } from "./RawDetails";
import { RawParsedDetails } from "./RawParsedDetails";
import { SignatureContext } from "../../pages/TransactionDetailsPage";
import {
  useFetchRawTransaction,
  useRawTransactionDetails,
} from "providers/transactions/raw";
import { Address } from "components/common/Address";
import ContentCard from "components/common/ContentCard";
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

type InstructionProps = {
  title: string;
  children?: React.ReactNode;
  result: SignatureResult;
  index: number;
  ix: TransactionInstruction | ParsedInstruction;
  defaultRaw?: boolean;
  innerCards?: JSX.Element[];
  childIndex?: number;
  className?: string;
};

export function InstructionCard({
  title,
  children,
  result,
  index,
  ix,
  defaultRaw,
  innerCards,
  childIndex,
  className
}: InstructionProps) {
  // const [resultClass] = ixResult(result, index);
  const [showRaw, setShowRaw] = React.useState(defaultRaw || false);
  const signature = useContext(SignatureContext);
  const rawDetails = useRawTransactionDetails(signature);

  let raw: TransactionInstruction | undefined = undefined;
  if (rawDetails && childIndex === undefined) {
    raw = rawDetails?.data?.raw?.transaction.instructions[index];
  }

  const fetchRaw = useFetchRawTransaction();
  const fetchRawTrigger = () => fetchRaw(signature);

  const rawClickHandler = () => {
    if (!defaultRaw && !showRaw && !raw) {
      fetchRawTrigger();
    }

    return setShowRaw((r) => !r);
  };

  return (
      // {/* <div className="card-header">
      //   <h3 className="card-header-title mb-0 d-flex align-items-center">
      //     <span className={`badge badge-soft-${resultClass} mr-2`}>
      //       #{index + 1}
      //       {childIndex !== undefined ? `.${childIndex + 1}` : ""}
      //     </span>
      //     {title}
      //   </h3> */}
    <ContentCard
      className={className}
      title={(
        <div className="flex items-center gap-2">
          <Chip label={`#${index + 1}${childIndex !== undefined ? `.${childIndex + 1}` : ""}`} variant="filled"/>
          <Typography variant="h3">{title}</Typography>
        </div>
      )}
      action={(
        <Button variant="outlined" size="small"
          disabled={defaultRaw}
          onClick={rawClickHandler}
        >
          {`<>Raw`}
        </Button>
      )}
    >
      <TableContainer>
        <Table>
          <TableBody>
            {showRaw ? (
              <>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell align="right">
                    <Address pubkey={ix.programId} alignRight link />
                  </TableCell>
                </TableRow>
                {"parsed" in ix ? (
                  <RawParsedDetails ix={ix}>
                    {raw ? <RawDetails ix={raw} /> : null}
                  </RawParsedDetails>
                ) : (
                  <RawDetails ix={ix} />
                )}
              </>
            ) : (
              children
            )}
            {innerCards && innerCards.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  Inner Instructions
                  <div className="inner-cards">{innerCards}</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}

// function ixResult(result: SignatureResult, index: number) {
//   if (result.err) {
//     const err = result.err as any;
//     const ixError = err["InstructionError"];
//     if (ixError && Array.isArray(ixError)) {
//       const [errorIndex, error] = ixError;
//       if (Number.isInteger(errorIndex) && errorIndex === index) {
//         return ["warning", `Error: ${JSON.stringify(error)}`];
//       }
//     }
//     return ["dark"];
//   }
//   return ["success"];
// }
