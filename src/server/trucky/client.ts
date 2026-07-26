import "server-only";

const baseUrl = () => process.env.TRUCKY_API_BASE_URL ?? "https://e.truckyapp.com/api/v1";

export function getTruckyConfiguration() {
  return {
    companyId: process.env.TRUCKY_COMPANY_ID,
    token: process.env.TRUCKY_COMPANY_TOKEN,
    webhookSecret: process.env.TRUCKY_WEBHOOK_SECRET,
    userAgent: process.env.TRUCKY_USER_AGENT ?? "El Jefe Logistics Driver Hub",
  };
}

export async function fetchCompanyJobs() {
  const config = getTruckyConfiguration();
  if (!config.companyId || !config.token) throw new Error("TRUCKY_COMPANY_ID and TRUCKY_COMPANY_TOKEN must be configured.");
  const response = await fetch(`${baseUrl()}/company/${encodeURIComponent(config.companyId)}/jobs`, {
    headers: {
      "x-access-token": config.token,
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": config.userAgent,
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Trucky API returned ${response.status}.`);
  const payload: unknown = await response.json();
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["data", "jobs", "results"]) if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  throw new Error("Trucky jobs response did not contain a job list.");
}
