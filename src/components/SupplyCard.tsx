import React from "react";
import { useSupply, useFetchSupply, Status } from "providers/supply";
import { LoadingCard } from "./common/LoadingCard";
import { ErrorCard } from "./common/ErrorCard";
import { SolBalance } from "utils";

import ContentCard from "../components/common/ContentCard";
import { Typography, Table, TableContainer, TableBody, TableRow, TableCell, useMediaQuery, useTheme } from "@mui/material";

export function SupplyCard() {
  const supply = useSupply();
  const fetchSupply = useFetchSupply();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  // Fetch supply on load
  React.useEffect(() => {
    if (supply === Status.Idle) fetchSupply();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (supply === Status.Disconnected) {
    return <ErrorCard text="Not connected to the cluster" />;
  }

  if (supply === Status.Idle || supply === Status.Connecting)
    return <LoadingCard />;

  if (typeof supply === "string") {
    return <ErrorCard text={supply} retry={fetchSupply} />;
  }

  return (
    <ContentCard
      title={(
        <Typography variant="h3"> Supply Overview </Typography>
      )}
    >
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell> Total Supply (VLX) </TableCell>
              <TableCell align={matches?"right":"left"}> <SolBalance lamports={supply.total} maximumFractionDigits={0} /> </TableCell>
            </TableRow>
            <TableRow>
              <TableCell> Circulating Supply (VLX) </TableCell>
              <TableCell align={matches?"right":"left"}>
                <SolBalance
                  lamports={supply.circulating}
                  maximumFractionDigits={0}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell> Non-Circulating Supply (VLX) </TableCell>
              <TableCell align={matches?"right":"left"}>
                <SolBalance
                  lamports={supply.nonCirculating}
                  maximumFractionDigits={0}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ContentCard>
  );
}
