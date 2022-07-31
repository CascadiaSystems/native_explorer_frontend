import { useState, ReactNode } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from "@mui/material";

type CopyState = "copy" | "copied" | "errored";

export function Copyable({
  text,
  children,
  align,
  replaceText,
}: {
  text: string;
  children: ReactNode;
  replaceText?: boolean;
  align?: "start" | "end"
}) {
  const [state, setState] = useState<CopyState>("copy");

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch (err) {
      setState("errored");
    }
    setTimeout(() => setState("copy"), 1000);
  };

  function CopyIcon() {
    if (state === "copy") {
      return (
        // <FontAwesomeIcon icon={faCheck} />
        <IconButton disableRipple onClick={handleClick} size="small" color="primary">
          <FontAwesomeIcon icon={faClone} />          
        </IconButton>
      );
    } else if (state === "copied") {
      return <FontAwesomeIcon icon={faCheck} />          
    } else if (state === "errored") {
      return (
        <span
          className="fe fe-x-circle"
          title="Please check your browser's copy permissions."
        ></span>
      );
    }
    return null;
  }

  // let message = "";
  // let textColor = "";
  // if (state === "copied") {
  //   message = "Copied";
  //   textColor = "text-info";
  // } else if (state === "errored") {
  //   message = "Copy Failed";
  //   textColor = "text-danger";
  // }
  
  return (
    <div className={`flex items-center gap-2 justify-${align?align:"start"}`}>
      <CopyIcon />
      { children }
    </div>
  );
}
