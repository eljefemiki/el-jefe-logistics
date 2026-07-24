import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm from "@/components/customers/CustomerForm";

export default function NewCustomerPage() {
  return <DashboardLayout title="Add customer" subtitle="Create a customer account for sales and dispatch."><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold text-white">Add customer</h1><p className="mb-8 mt-2 text-slate-400">Record the primary contact, operating address and commercial terms.</p><CustomerForm /></div></DashboardLayout>;
}
