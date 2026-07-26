import { Truck, UserRound } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import PrivateProfileForm from "@/components/account/PrivateProfileForm";
import ProfilePhotoForm from "@/components/account/ProfilePhotoForm";
import DriverPerformanceDashboard from "@/components/account/DriverPerformanceDashboard";
import { requireAccount } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { trailerLabels } from "@/src/lib/ets2-trailers";
import { getDriverPerformance } from "@/src/server/driver-performance/queries";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  searchParams: Promise<{
    discord?: string | string[];
    photo?: string | string[];
  }>;
}

const discordMessages: Record<string, string> = {
  verified: "Discord has been linked and your server membership is verified.",
  not_member: "That Discord account has not joined the El Jefe Logistics server yet.",
  denied: "Discord linking was cancelled.",
  failed: "Discord could not be verified. Please try again.",
};
const photoMessages: Record<string, string> = {
  saved: "Your profile photo has been updated.",
  invalid: "Choose a valid JPG, PNG, or WebP image no larger than 5 MB.",
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const sessionAccount = await requireAccount("/profile");
  const params = await searchParams;
  const discordStatus = Array.isArray(params.discord)
    ? params.discord[0]
    : params.discord;
  const photoStatus = Array.isArray(params.photo)
    ? params.photo[0]
    : params.photo;
  const account = await prisma.account.findUniqueOrThrow({
    where: { id: sessionAccount.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      steamId: true,
      truckyUsername: true,
      discordId: true,
      discordUsername: true,
      discordDisplayName: true,
      discordVerifiedAt: true,
      discordGuildJoinedAt: true,
      profileImageMime: true,
      profileImageUpdatedAt: true,
      driver: {
        select: {
          id: true,
          assignedTrailer: true,
          reputation: true,
          totalDistanceKm: true,
        },
      },
    },
  });
  const performance = account.driver
    ? await getDriverPerformance(account.driver.id)
    : null;
  const name = `${account.firstName} ${account.lastName}`.trim();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 py-16 text-white">
        <Container>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400"><UserRound className="h-8 w-8" /></div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-blue-400">My profile</p>
                <h1 className="mt-2 text-4xl font-black">{account.firstName} {account.lastName}</h1>
                <p className="mt-2 text-slate-400">{account.email}</p>
              </div>
            </div>
            <ProfilePhotoForm
              name={name}
              hasPhoto={Boolean(account.profileImageMime)}
              updatedAt={account.profileImageUpdatedAt}
              message={photoStatus ? photoMessages[photoStatus] : undefined}
            />
            <PrivateProfileForm
              profile={account}
              discordEnabled={Boolean(
                process.env.DISCORD_CLIENT_ID &&
                  process.env.DISCORD_CLIENT_SECRET &&
                  process.env.DISCORD_GUILD_ID,
              )}
              discordMessage={
                discordStatus ? discordMessages[discordStatus] : undefined
              }
            />
            {performance && account.driver && (
              <DriverPerformanceDashboard
                performance={performance}
                fallbackReputation={account.driver.reputation}
                fallbackDistanceKm={account.driver.totalDistanceKm}
              />
            )}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-semibold">Assigned ETS2 trailer</h2>
                  <p className="mt-1 text-sm text-slate-400">Managed by the fleet team and used to match eligible marketplace cargo.</p>
                </div>
              </div>
              <p className="mt-5 rounded-xl bg-slate-950 p-4 font-medium text-white">
                {account.driver?.assignedTrailer ? trailerLabels[account.driver.assignedTrailer] : "No trailer assigned yet"}
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
