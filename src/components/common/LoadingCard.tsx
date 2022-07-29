import ContentCard from "./ContentCard";

export function LoadingCard({ message, className }: { message?: string, className?: string }) {
  return (
    <ContentCard className={`p-4 text-center ${className}`}>
      {message || "Loading"}
    </ContentCard>
  );
}
