import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { clusterPath } from "utils/url";
import { Copyable } from "./Copyable";

type Props = {
  slot: number;
  link?: boolean;
};
export function Slot({ slot, link }: Props) {
  return link ? (
    <Copyable text={slot.toString()}>
      <span className="text-monospace">
        <Link to={clusterPath(`/block/${slot}`)}>
          <Typography color="secondary" className="hover:text-primary">
            { slot.toLocaleString("en-US") }
          </Typography>
        </Link>
      </span>
    </Copyable>
  ) : (
    <span className="text-monospace">{slot.toLocaleString("en-US")}</span>
  );
}
