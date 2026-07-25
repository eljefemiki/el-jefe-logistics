import DashboardLayout from "@/components/layout/DashboardLayout";
import ContractListingForm from "@/components/marketplace/ContractListingForm";
import { requirePermission } from "@/src/lib/auth";
import { getMarketplaceCustomers } from "@/src/server/marketplace/service";
export default async function NewContractListingPage() {
  await requirePermission("marketplace:manage"); const customers = await getMarketplaceCustomers();
  return <DashboardLayout title="Create marketplace contract" subtitle="Define the route, commercial ceiling and automated fulfilment terms."><div className="mx-auto max-w-5xl"><h1 className="mb-2 text-3xl font-bold text-white">New contract opportunity</h1><p className="mb-8 text-slate-400">Save privately as a draft or publish immediately for competitive bids.</p><ContractListingForm customers={customers} /></div></DashboardLayout>;
}
