import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm from "@/components/customers/CustomerForm";
import { getCustomer } from "@/src/server/customers/service";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();
  return <DashboardLayout title={`Edit ${customer.companyName}`} subtitle="Update customer contact and commercial details."><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold text-white">Edit customer</h1><p className="mb-8 mt-2 text-slate-400">{customer.customerNumber} · {customer.companyName}</p><CustomerForm customer={customer} /></div></DashboardLayout>;
}
