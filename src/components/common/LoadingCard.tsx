import ContentCard from "./ContentCard";

export function LoadingCard({ message }: { message?: string }) {
  return (
    <ContentCard className="p-4 text-center">
      {message || "Loading"}
    </ContentCard>
  );
}
