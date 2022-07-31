import { CircularProgress } from "@mui/material";
import ContentCard from "./ContentCard";

export function LoadingCard({ message, className }: { message?: string, className?: string }) {
  return (
    <ContentCard className={`p-4 text-center ${className}`}>
      <div className="flex justify-center items-center gap-2">
        <CircularProgress size={20} color="primary" />
        {message || "Loading"}
      </div>
    </ContentCard>
  );
}
