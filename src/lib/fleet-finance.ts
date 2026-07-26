export const leaseTerms = [24, 36, 48] as const;

export type LeaseTermMonths = (typeof leaseTerms)[number];

export interface LeaseSummary {
  monthlyPayment: number;
  paymentsMade: number;
  amountPaid: number;
  remainingBalance: number;
  progressPercent: number;
  endDate: Date;
  isPaidOff: boolean;
}

function completedMonths(startDate: Date, asOf: Date) {
  if (asOf < startDate) return 0;

  let months =
    (asOf.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    asOf.getUTCMonth() -
    startDate.getUTCMonth();

  if (asOf.getUTCDate() < startDate.getUTCDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function calculateLeaseSummary(
  vehicleValue: number,
  termMonths: LeaseTermMonths,
  startDate: Date,
  asOf = new Date(),
): LeaseSummary {
  const monthlyPayment = vehicleValue / termMonths;
  const paymentsMade = Math.min(
    termMonths,
    completedMonths(startDate, asOf),
  );
  const amountPaid = Math.min(vehicleValue, monthlyPayment * paymentsMade);
  const remainingBalance = Math.max(0, vehicleValue - amountPaid);
  const endDate = new Date(startDate);
  endDate.setUTCMonth(endDate.getUTCMonth() + termMonths);

  return {
    monthlyPayment,
    paymentsMade,
    amountPaid,
    remainingBalance,
    progressPercent: (paymentsMade / termMonths) * 100,
    endDate,
    isPaidOff: paymentsMade >= termMonths,
  };
}
