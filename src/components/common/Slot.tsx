import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { clusterPath } from "utils/url";
import { Copyable } from "./Copyable";

type Props = {
  slot: number;
  link?: boolean;
  align?: "start"|"end";
};
export function Slot({ slot, link, align }: Props) {
  return link ? (
    <Copyable text={slot.toString()} align={align}>
      <Link to={clusterPath(`/block/${slot}`)}>
        <Typography color="secondary" className={`${link?"hover:text-primary":""} font-mono`}>
          { slot.toLocaleString("en-US") }
        </Typography>
      </Link>
    </Copyable>
  ) : (
    <span className="font-mono">{slot.toLocaleString("en-US")}</span>
  );
}
