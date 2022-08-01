import { useMediaQuery, useTheme } from "@mui/material";
import { SignatureResult, TransactionInstruction } from "@velas/web3";
import { Address } from "components/common/Address";
import { InstructionCard } from "../InstructionCard";

export function GenericMngoAccountDetailsCard(props: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  mangoAccountKeyLocation: number;
  title: String;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const {
    ix,
    index,
    result,
    mangoAccountKeyLocation,
    title,
    innerCards,
    childIndex,
  } = props;
  const mangoAccount = ix.keys[mangoAccountKeyLocation];

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title={"Mango: " + title}
      innerCards={innerCards}
      childIndex={childIndex}
    >
      <tr>
        <td>Mango account</td>
        <td>
          <Address pubkey={mangoAccount.pubkey} alignRight={matches} link />
        </td>
      </tr>
    </InstructionCard>
  );
}
