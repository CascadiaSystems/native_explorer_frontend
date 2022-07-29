import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AccountBalancePair } from "@velas/web3";
import { useRichList, useFetchRichList, Status } from "providers/richList";
import { LoadingCard } from "./common/LoadingCard";
import { ErrorCard } from "./common/ErrorCard";
import { SolBalance } from "utils";
import { useQuery } from "utils/url";
import { useSupply } from "providers/supply";
import { Address } from "./common/Address";
import { Button, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';

import ContentCard from "../components/common/ContentCard";

type Filter = "circulating" | "nonCirculating" | "all" | null;

export function TopAccountsCard() {
  const supply = useSupply();
  const richList = useRichList();
  const fetchRichList = useFetchRichList();
  const filter = useQueryFilter();
  const location = useLocation();
  const history = useHistory();


  if (typeof supply !== "object") return null;

  if (richList === Status.Disconnected) {
    return <ErrorCard text="Not connected to the cluster" />;
  }

  if (richList === Status.Connecting) {
    return <LoadingCard className="mt-6" />;
  }

  if (typeof richList === "string") {
    return <ErrorCard text={richList} retry={fetchRichList} className="mt-6" />;
  }

  let supplyCount: number;
  let accounts, header;

  if (richList !== Status.Idle) {
    switch (filter) {
      case "nonCirculating": {
        accounts = richList.nonCirculating;
        supplyCount = supply.nonCirculating;
        header = "Non-Circulating";
        break;
      }
      case "all": {
        accounts = richList.total;
        supplyCount = supply.total;
        header = "Total";
        break;
      }
      case "circulating":
      default: {
        accounts = richList.circulating;
        supplyCount = supply.circulating;
        header = "Circulating";
        break;
      }
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'circulating') {
      history.push({pathname: location.pathname});
    } else {
      history.push({pathname: location.pathname, search: `filter=${event.target.value}`});
    }
  }

  return (
    <>
      <ContentCard
        className="mt-6"
        title={
          <Typography variant="h3"> Largest Accounts </Typography>
        }
        action={(
          <Select size="small"
            value={filter?filter:'circulating'}
            onChange={handleChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="circulating">Circulating</MenuItem>
            <MenuItem value="nonCirculating">Non-Circulating</MenuItem>
          </Select>
        )}
      >
        {richList === Status.Idle && (
          <div className="p-4">
            <Button variant="outlined"
              color="primary"
              disableRipple
              onClick={fetchRichList}
            >
              Load Largest Accounts
            </Button>
          </div>
        )}

        {accounts && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Rank </TableCell>
                  <TableCell> Address </TableCell>
                  <TableCell align="right"> Balance (VLX) </TableCell>
                  <TableCell align="right"> % of {header} Supply </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  accounts.map((account, index) =>
                    renderAccountRow(account, index, supplyCount)
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ContentCard>
    </>
  );
}

const renderAccountRow = (
  account: AccountBalancePair,
  index: number,
  supply: number
) => {
  return (
    <TableRow key={index}>
      <TableCell> { index + 1 } </TableCell>
      <TableCell> <Address pubkey={account.address} link /> </TableCell>
      <TableCell align="right"> <SolBalance lamports={account.lamports} maximumFractionDigits={0} /> </TableCell>
      <TableCell align="right"> {`${((100 * account.lamports) / supply).toFixed(3)}%`} </TableCell>
    </TableRow>
  );
};

const useQueryFilter = (): Filter => {
  const query = useQuery();
  const filter = query.get("filter");
  if (
    filter === "circulating" ||
    filter === "nonCirculating" ||
    filter === "all"
  ) {
    return filter;
  } else {
    return null;
  }
};
