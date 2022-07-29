import { Button } from "@mui/material";
import React from "react";
import ContentCard from "./ContentCard";

export function ErrorCard({
  retry,
  retryText,
  text,
  subtext,
}: {
  retry?: () => void;
  retryText?: string;
  text: string;
  subtext?: string;
}) {
  const buttonText = retryText || "Try Again";
  return (
    <>
      <ContentCard>
        <div className="text-center">
          <div className="flex flex-row gap-4 items-center justify-center p-4">
            {text}
            {retry && (
              <Button variant="outlined" size="small"
                disableRipple onClick={retry}>
                {buttonText}
              </Button>                
            )}
          </div>
          {retry && subtext && (
            <>
              <hr  className="border-grey-light"/>
              <div className="p-4">
                {subtext}
              </div>
            </>
          )}
        </div>
      </ContentCard>
    </>
  );
}
