import test from "node:test";
import assert from "node:assert/strict";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const databaseUrl = process.env.TEST_DATABASE_URL;
const enabled = Boolean(databaseUrl);
const runId = `release-${process.pid}-${Date.now()}`;

function createClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

test("database-backed marketplace award is atomic and owner-scoped", { skip: !enabled }, async () => {
  const prisma = createClient();
  process.env.DATABASE_URL = databaseUrl;
  const { acceptContractBid, insertContractBid, insertContractListing } = await import("../src/server/marketplace/repository.ts");
  const owner = await prisma.account.create({
    data: {
      email: `${runId}-owner@example.test`,
      passwordHash: "integration-only",
      firstName: "Release",
      lastName: "Owner",
      role: "DISPATCHER",
    },
  });
  const otherOwner = await prisma.account.create({
    data: {
      email: `${runId}-other@example.test`,
      passwordHash: "integration-only",
      firstName: "Other",
      lastName: "Owner",
      role: "DISPATCHER",
    },
  });
  const customer = await prisma.customer.create({
    data: {
      customerNumber: `${runId}-customer`,
      companyName: "Release Test Customer",
      status: "ACTIVE",
      contactFirstName: "Test",
      contactLastName: "Customer",
      email: `${runId}-customer@example.test`,
    },
  });
  await prisma.driver.create({
    data: {
      accountId: owner.id,
      employeeNumber: `${runId}-driver`,
      assignedTrailer: "DRY_FREIGHT",
    },
  });
  await prisma.driver.create({
    data: {
      accountId: otherOwner.id,
      employeeNumber: `${runId}-other-driver`,
      assignedTrailer: "REFRIGERATED",
    },
  });
  const listing = await insertContractListing(`${runId}-contract`, owner.id, {
      title: "Critical freight workflow",
      description: "Database-backed release integration test.",
      customerId: customer.id,
      origin: "London",
      destination: "Manchester",
      cargoType: "General",
      cargoCategory: "GENERAL",
      requiredTrailer: "DRY_FREIGHT",
      pickupDate: new Date("2026-08-01T09:00:00Z"),
      deliveryDate: new Date("2026-08-02T17:00:00Z"),
      budget: 2500,
      currency: "GBP",
      contractTerms: "Tracked and insured delivery.",
      publish: true,
  });
  await assert.rejects(
    insertContractBid(listing.id, otherOwner.id, { amount: 2050, estimatedDays: 1, proposal: "Refrigerated trailer cannot serve dry freight." }),
    /not compatible/,
  );
  const bids = [
    await insertContractBid(listing.id, owner.id, { amount: 2100, estimatedDays: 1, proposal: "Dedicated vehicle with the correct dry freight trailer." }),
    await insertContractBid(listing.id, owner.id, { amount: 2200, estimatedDays: 2, proposal: "Tracked vehicle with the correct assigned trailer." }),
  ];

  await assert.rejects(
    acceptContractBid(listing.id, bids[0].id, otherOwner.id),
    /can no longer be awarded/,
  );

  const winningBid = bids[0];
  await acceptContractBid(listing.id, winningBid.id, owner.id);

  const awarded = await prisma.contractListing.findUnique({
    where: { id: listing.id },
    include: { bids: true },
  });
  assert.equal(awarded.status, "AWARDED");
  assert.equal(awarded.awardedBidId, winningBid.id);
  assert.deepEqual(
    awarded.bids.map(({ status }) => status).sort(),
    ["ACCEPTED", "REJECTED"],
  );
  const { recordDriverPerformanceEntry } = await import(
    "../src/server/driver-performance/repository.ts"
  );
  const completed = await recordDriverPerformanceEntry(owner.id, {
    driverId: winningBid.driverId,
    customerId: customer.id,
    contractListingId: listing.id,
    distanceKm: 350,
    cargoTonnes: 22,
    income: 2500,
    repairCosts: 150,
    damageCosts: 75,
    otherCosts: 125,
    expenditure: 350,
    reputationScore: 96,
    completedAt: new Date(),
  });
  assert.equal(completed.invoice.subtotal, 2500);
  assert.equal(completed.invoice.driverPerformanceEntryId, completed.entry.id);
  const closedListing = await prisma.contractListing.findUniqueOrThrow({ where: { id: listing.id } });
  assert.equal(closedListing.status, "CLOSED");
  await assert.rejects(
    recordDriverPerformanceEntry(owner.id, {
      driverId: winningBid.driverId,
      customerId: customer.id,
      contractListingId: listing.id,
      distanceKm: 350,
      cargoTonnes: 22,
      income: 2500,
      repairCosts: 0,
      damageCosts: 0,
      otherCosts: 0,
      expenditure: 0,
      reputationScore: 96,
      completedAt: new Date(),
    }),
  );
  await prisma.$disconnect();
});

test("database-backed maintenance completion restores fleet availability only after the last open job", { skip: !enabled }, async () => {
  const prisma = createClient();
  process.env.DATABASE_URL = databaseUrl;
  const { insertMaintenanceJob, reviseMaintenanceJob } = await import("../src/server/workshop/repository.ts");
  const truck = await prisma.truck.create({
    data: {
      fleetNumber: `${runId}-fleet`,
      registration: `${runId}-reg`,
      manufacturer: "VOLVO",
      model: "FH",
      type: "TRACTOR",
      year: 2025,
      status: "AVAILABLE",
    },
  });
  const jobs = [];
  for (const [index, title] of ["Brake inspection", "Scheduled service"].entries()) {
    jobs.push(await insertMaintenanceJob(`${runId}-job-${index}`, {
      truckId: truck.id,
      title,
      type: "INSPECTION",
      priority: "ROUTINE",
      status: "REPORTED",
    }));
  }

  for (const [index, job] of jobs.entries()) {
    await reviseMaintenanceJob(job.id, {
      truckId: truck.id,
      title: job.title,
      type: job.type,
      priority: job.priority,
      status: "COMPLETED",
      odometerKm: job.odometerKm ?? undefined,
      description: job.description ?? undefined,
      technician: job.technician ?? undefined,
      vendor: job.vendor ?? undefined,
      scheduledFor: job.scheduledFor ?? undefined,
      estimatedCost: job.estimatedCost ?? undefined,
      actualCost: job.actualCost ?? undefined,
      notes: job.notes ?? undefined,
    });
    const updated = await prisma.truck.findUniqueOrThrow({ where: { id: truck.id } });
    assert.equal(updated.status, index === 0 ? "MAINTENANCE" : "AVAILABLE");
  }

  const replacementTruck = await prisma.truck.create({
    data: {
      fleetNumber: `${runId}-replacement-fleet`,
      registration: `${runId}-replacement-reg`,
      manufacturer: "SCANIA",
      model: "S",
      type: "TRACTOR",
      year: 2026,
      status: "AVAILABLE",
    },
  });
  const movedJob = await insertMaintenanceJob(`${runId}-moved-job`, {
    truckId: truck.id,
    title: "Move to replacement truck",
    type: "REPAIR",
    priority: "HIGH",
    status: "REPORTED",
  });
  await reviseMaintenanceJob(movedJob.id, {
    truckId: replacementTruck.id,
    title: movedJob.title,
    type: movedJob.type,
    priority: movedJob.priority,
    status: "IN_PROGRESS",
  });
  const [oldTruck, newTruck] = await Promise.all([
    prisma.truck.findUniqueOrThrow({ where: { id: truck.id } }),
    prisma.truck.findUniqueOrThrow({ where: { id: replacementTruck.id } }),
  ]);
  assert.equal(oldTruck.status, "AVAILABLE");
  assert.equal(newTruck.status, "MAINTENANCE");

  await prisma.truck.update({
    where: { id: truck.id },
    data: { archivedAt: new Date() },
  });
  const { findWorkshopTrucks } = await import("../src/server/workshop/repository.ts");
  const selectableTrucks = await findWorkshopTrucks();
  assert.equal(selectableTrucks.some(({ id }) => id === truck.id), false);
  await prisma.$disconnect();
});

test("database-backed driver performance updates lifetime totals atomically", { skip: !enabled }, async () => {
  const prisma = createClient();
  process.env.DATABASE_URL = databaseUrl;
  const { recordDriverPerformanceEntry } = await import(
    "../src/server/driver-performance/repository.ts"
  );
  const account = await prisma.account.create({
    data: {
      email: `${runId}-performance@example.test`,
      passwordHash: "integration-only",
      firstName: "Performance",
      lastName: "Driver",
      role: "MANAGER",
    },
  });
  const driver = await prisma.driver.create({
    data: {
      accountId: account.id,
      employeeNumber: `${runId}-performance-driver`,
      totalDistanceKm: 1000,
      totalDeliveries: 2,
    },
  });
  const customer = await prisma.customer.create({
    data: {
      customerNumber: `${runId}-performance-customer`,
      companyName: "Performance Customer",
      status: "ACTIVE",
      contactFirstName: "Test",
      contactLastName: "Customer",
      email: `${runId}-performance-customer@example.test`,
    },
  });

  const result = await recordDriverPerformanceEntry(account.id, {
    driverId: driver.id,
    customerId: customer.id,
    distanceKm: 750,
    cargoTonnes: 18.5,
    income: 2200,
    repairCosts: 200,
    damageCosts: 100,
    otherCosts: 300,
    expenditure: 600,
    reputationScore: 94,
    completedAt: new Date("2026-07-20T12:00:00Z"),
  });

  assert.equal(result.driver.totalDistanceKm, 1750);
  assert.equal(result.driver.totalDeliveries, 3);
  assert.equal(result.driver.reputation, 94);
  assert.equal(result.entry.income - result.entry.expenditure, 1600);
  assert.equal(result.invoice.subtotal, 2200);
  assert.equal(result.invoice.driverPerformanceEntryId, result.entry.id);
  await prisma.$disconnect();
});

test("database-backed fuel edits preserve odometers and refresh both affected trucks", { skip: !enabled }, async () => {
  const prisma = createClient();
  process.env.DATABASE_URL = databaseUrl;
  const { findFuelTrucks, insertFuelEntry, reviseFuelEntry } = await import("../src/server/fuel/repository.ts");
  const firstTruck = await prisma.truck.create({
    data: {
      fleetNumber: `${runId}-fuel-a`,
      registration: `${runId}-fuel-reg-a`,
      manufacturer: "VOLVO",
      model: "FH",
      type: "TRACTOR",
      year: 2025,
      mileage: 1000,
      fuelLevel: 20,
    },
  });
  const secondTruck = await prisma.truck.create({
    data: {
      fleetNumber: `${runId}-fuel-b`,
      registration: `${runId}-fuel-reg-b`,
      manufacturer: "DAF",
      model: "XG",
      type: "TRACTOR",
      year: 2026,
      mileage: 500,
      fuelLevel: 10,
    },
  });
  const latest = await insertFuelEntry(`${runId}-fuel-latest`, {
    truckId: firstTruck.id,
    fuelType: "DIESEL",
    quantity: 400,
    unitPrice: 1.5,
    odometerKm: 1200,
    fuelLevelAfter: 80,
    station: "Integration Fuel",
    purchasedAt: new Date("2026-07-20T12:00:00Z"),
  });
  await insertFuelEntry(`${runId}-fuel-history`, {
    truckId: firstTruck.id,
    fuelType: "DIESEL",
    quantity: 200,
    unitPrice: 1.4,
    odometerKm: 900,
    fuelLevelAfter: 40,
    station: "Historical Fuel",
    purchasedAt: new Date("2026-07-10T12:00:00Z"),
  });
  let refreshedFirst = await prisma.truck.findUniqueOrThrow({ where: { id: firstTruck.id } });
  assert.equal(refreshedFirst.mileage, 1200);
  assert.equal(refreshedFirst.fuelLevel, 80);

  await reviseFuelEntry(latest.id, {
    truckId: secondTruck.id,
    fuelType: latest.fuelType,
    quantity: latest.quantity,
    unitPrice: latest.unitPrice,
    odometerKm: 1300,
    fuelLevelAfter: 90,
    station: latest.station,
    purchasedAt: latest.purchasedAt,
  });
  const [oldTruck, newTruck] = await Promise.all([
    prisma.truck.findUniqueOrThrow({ where: { id: firstTruck.id } }),
    prisma.truck.findUniqueOrThrow({ where: { id: secondTruck.id } }),
  ]);
  assert.equal(oldTruck.mileage, 1200);
  assert.equal(oldTruck.fuelLevel, 40);
  assert.equal(newTruck.mileage, 1300);
  assert.equal(newTruck.fuelLevel, 90);

  await prisma.truck.update({ where: { id: firstTruck.id }, data: { archivedAt: new Date() } });
  const selectable = await findFuelTrucks();
  assert.equal(selectable.some(({ id }) => id === firstTruck.id), false);
  await prisma.$disconnect();
});
