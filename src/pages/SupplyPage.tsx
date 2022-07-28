import React from "react";
import { TopAccountsCard } from "components/TopAccountsCard";
import { SupplyCard } from "components/SupplyCard";

export function SupplyPage() {
  return (
    <div className="mt-6">
      <SupplyCard />
      <TopAccountsCard />
    </div>
  );
}
