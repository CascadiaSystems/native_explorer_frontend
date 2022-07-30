import React from "react";
import { Address } from "./Address";
import { Account } from "providers/accounts";
import { SolBalance } from "utils";
import { TableRow, TableCell } from "@mui/material";

type AccountHeaderProps = {
  title: string;
  refresh: Function;
};

type AccountProps = {
  account: Account;
};

export function AccountHeader({ title, refresh }: AccountHeaderProps) {
  return (
    <div className="card-header align-items-center">
      <h3 className="card-header-title">{title}</h3>
      <button className="btn btn-white btn-sm" onClick={() => refresh()}>
        <span className="fe fe-refresh-cw mr-2"></span>
        Refresh
      </button>
    </div>
  );
}

export function AccountAddressRow({ account }: AccountProps) {
  return (
    <TableRow>
      <TableCell>Address</TableCell>
      <TableCell align="right">
        <Address pubkey={account.pubkey} alignRight raw />
      </TableCell>
    </TableRow>
  );
}

export function AccountBalanceRow({ account }: AccountProps) {
  const { lamports } = account;
  return (
    <TableRow>
      <TableCell>Balance (VLX)</TableCell>
      <TableCell align="right">
        <SolBalance lamports={lamports} />
      </TableCell>
    </TableRow>
  );
}

export function AccountOwnerRow({ account }: AccountProps) {
  if (account.details) {
    return (
      <TableRow>
        <TableCell>Owner</TableCell>
        <TableCell align="right">
          <Address pubkey={account.details.owner} alignRight link />
        </TableCell>
      </TableRow>
    );
  }

  return <></>;
}
