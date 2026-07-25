import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { requirePermission } from "@/src/lib/auth";
import { getNotifications } from "@/src/server/platform/notifications";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/src/server/platform/actions";
export const dynamic = "force-dynamic";
export default async function NotificationsPage() {
  const account = await requirePermission("notifications:view"); const notifications = await getNotifications(account.id);
  return <DashboardLayout title="Notifications Centre" subtitle="Operational alerts and activity from every module."><div className="space-y-5">
    <div className="flex items-center justify-between"><h1 className="text-3xl font-bold text-white">Notifications</h1><form action={markAllNotificationsReadAction}><button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Mark all read</button></form></div>
    {notifications.length === 0 ? <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">You’re all caught up.</div> :
      <div className="space-y-3">{notifications.map(item => <article key={item.id} className={`rounded-xl border p-5 ${item.readAt ? "border-slate-800 bg-slate-900/60" : "border-blue-500/30 bg-blue-500/10"}`}><div className="flex flex-col gap-3 sm:flex-row sm:justify-between"><div><div className="flex items-center gap-2"><span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{item.type}</span><span className="text-xs text-slate-500">{item.severity}</span></div><h2 className="mt-2 font-semibold text-white">{item.title}</h2><p className="mt-1 text-sm text-slate-300">{item.message}</p><p className="mt-2 text-xs text-slate-500">{item.createdAt.toLocaleString("en-GB")}</p></div><div className="flex gap-2">{item.entityHref && <Link href={item.entityHref} className="text-sm text-blue-400">Open</Link>}{!item.readAt && <form action={markNotificationReadAction.bind(null, item.id)}><button className="text-sm text-slate-300">Mark read</button></form>}</div></div></article>)}</div>}
  </div></DashboardLayout>;
}
