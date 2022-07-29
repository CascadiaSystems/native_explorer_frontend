import React from "react";

import { ErrorCard } from "components/common/ErrorCard";
import { BlockOverviewCard } from "components/block/BlockOverviewCard";
import { Typography } from "@mui/material";

// IE11 doesn't support Number.MAX_SAFE_INTEGER
const MAX_SAFE_INTEGER = 9007199254740991;

type Props = { slot: string; tab?: string };

export function BlockDetailsPage({ slot, tab }: Props) {
  const slotNumber = Number(slot);
  let output = <ErrorCard text={`Block ${slot} is not valid`} />;

  if (
    !isNaN(slotNumber) &&
    slotNumber < MAX_SAFE_INTEGER &&
    slotNumber % 1 === 0
  ) {
    output = <BlockOverviewCard slot={slotNumber} tab={tab} />;
  }

  return (
    <>
      <Typography variant="h2" className="py-6">Block</Typography>
      {output}
    </>
  );
}
