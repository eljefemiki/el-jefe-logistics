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

async function fetchCompanyPath(path = "") {
  const config = getTruckyConfiguration();
  if (!config.companyId || !config.token) throw new Error("TRUCKY_COMPANY_ID and TRUCKY_COMPANY_TOKEN must be configured.");
  const response = await fetch(`${baseUrl()}/company/${encodeURIComponent(config.companyId)}${path}`, {
    headers: {
      "x-access-token": config.token,
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": config.userAgent,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Trucky API returned ${response.status}.`);
  return response.json() as Promise<unknown>;
}

function list(payload: unknown, keys: string[]) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of keys) if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [];
}

export async function fetchCompanyJobs() {
  const payload = await fetchCompanyPath("/jobs");
  const jobs = list(payload, ["data", "jobs", "results"]);
  if (!jobs.length && !Array.isArray(payload)) {
    const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    if (!["data", "jobs", "results"].some((key) => Array.isArray(record[key]))) {
      throw new Error("Trucky jobs response did not contain a job list.");
    }
  }
  return jobs;
}

export async function probeTruckyApi() {
  const startedAt = Date.now();
  const [company, members, jobs] = await Promise.all([
    fetchCompanyPath(), fetchCompanyPath("/members"), fetchCompanyPath("/jobs"),
  ]);
  return {
    ok: true as const,
    latencyMs: Date.now() - startedAt,
    companyAvailable: Boolean(company),
    memberCount: list(members, ["data", "members", "results"]).length,
    jobCount: list(jobs, ["data", "jobs", "results"]).length,
  };
}
