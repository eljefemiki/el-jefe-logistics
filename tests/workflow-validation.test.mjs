import test from "node:test";
import assert from "node:assert/strict";

import { loginSchema, registerSchema } from "../src/lib/validation.ts";
import { createTruckSchema, updateTruckSchema } from "../src/server/fleet/validation.ts";
import { updateDriverSchema } from "../src/server/drivers/validation.ts";
import { customerSchema } from "../src/server/customers/validation.ts";
import { maintenanceJobSchema } from "../src/server/workshop/validation.ts";
import { fuelEntrySchema } from "../src/server/fuel/validation.ts";
import { invoiceSchema } from "../src/server/finance/validation.ts";
import { contractBidSchema, contractListingSchema } from "../src/server/marketplace/validation.ts";

test("auth accepts valid login/registration and rejects weak or mismatched credentials", () => {
  assert.equal(loginSchema.safeParse({ email: "USER@example.com", password: "secret" }).success, true);
  assert.equal(registerSchema.safeParse({
    name: "Fleet Admin",
    email: "admin@example.com",
    steamId: "76561198000000000",
    truckyUserId: "123456",
    truckyUsername: "FleetAdmin",
    discordId: "123456789012345678",
    password: "long-password",
    confirmPassword: "long-password",
  }).success, true);
  assert.equal(registerSchema.safeParse({
    name: "Fleet Admin",
    email: "admin@example.com",
    steamId: "not-a-steam-id",
    truckyUserId: "",
    truckyUsername: "x",
    discordId: "discord-name",
    password: "short",
    confirmPassword: "different",
  }).success, false);
});

test("fleet create/edit validates identifiers, year, mileage, and fuel bounds", () => {
  const truck = {
    fleetNumber: "F-100",
    registration: "AB12 CDE",
    manufacturer: "VOLVO",
    model: "FH",
    type: "TRACTOR",
    year: 2025,
    mileage: 12000,
    fuelLevel: 70,
    status: "AVAILABLE",
  };
  assert.equal(createTruckSchema.safeParse(truck).success, true);
  assert.equal(createTruckSchema.safeParse({ ...truck, mileage: -1, fuelLevel: 101 }).success, false);
  assert.equal(updateTruckSchema.safeParse({ status: "MAINTENANCE", mileage: 12500 }).success, true);
});

test("driver edit validates identity, role-specific state, and operational counters", () => {
  assert.equal(updateDriverSchema.safeParse({
    firstName: "Ava",
    lastName: "Jones",
    email: "ava@example.com",
    employeeNumber: "DRV-10",
    rank: "SENIOR",
    status: "AVAILABLE",
    reputation: 98,
    totalDeliveries: 25,
  }).success, true);
  assert.equal(updateDriverSchema.safeParse({ email: "invalid", reputation: 101, totalDeliveries: -1 }).success, false);
});

test("customer create/edit validates contacts and commercial limits", () => {
  const customer = {
    companyName: "Northstar Foods",
    status: "ACTIVE",
    contactFirstName: "Nina",
    contactLastName: "Patel",
    email: "nina@northstar.example",
    country: "United Kingdom",
    creditLimit: 50000,
    paymentTermsDays: 30,
  };
  assert.equal(customerSchema.safeParse(customer).success, true);
  assert.equal(customerSchema.safeParse({ ...customer, email: "invalid", creditLimit: -1 }).success, false);
});

test("maintenance create and completion states validate safely", () => {
  const job = {
    truckId: "truck-1",
    title: "Replace brake pads",
    type: "REPAIR",
    priority: "HIGH",
    status: "REPORTED",
  };
  assert.equal(maintenanceJobSchema.safeParse(job).success, true);
  assert.equal(maintenanceJobSchema.safeParse({ ...job, status: "COMPLETED", actualCost: 450 }).success, true);
  assert.equal(maintenanceJobSchema.safeParse({ ...job, actualCost: -1 }).success, false);
});

test("fuel create rejects impossible quantity, price, odometer, and fuel level", () => {
  const entry = {
    truckId: "truck-1",
    fuelType: "DIESEL",
    quantity: 300,
    unitPrice: 1.55,
    odometerKm: 85000,
    fuelLevelAfter: 95,
    station: "North Depot",
    purchasedAt: new Date("2026-07-25"),
  };
  assert.equal(fuelEntrySchema.safeParse(entry).success, true);
  assert.equal(fuelEntrySchema.safeParse({ ...entry, quantity: 0, fuelLevelAfter: 101 }).success, false);
});

test("invoice create/payment enforces dates, totals, and paid state", () => {
  const invoice = {
    customerId: "customer-1",
    status: "SENT",
    description: "July haulage",
    issueDate: "2026-07-01",
    dueDate: "2026-07-31",
    subtotal: "1000",
    vatRate: "20",
    amountPaid: "0",
  };
  assert.equal(invoiceSchema.safeParse(invoice).success, true);
  assert.equal(invoiceSchema.safeParse({ ...invoice, status: "PAID", amountPaid: "1200", paidAt: "2026-07-20" }).success, true);
  assert.equal(invoiceSchema.safeParse({ ...invoice, amountPaid: "1201" }).success, false);
});

test("marketplace publish and bid acceptance inputs enforce dates and commercial terms", () => {
  const listing = {
    customerId: "customer-1",
    title: "London to Manchester chilled freight",
    description: "Temperature-controlled delivery with tracked handoff and proof of delivery.",
    origin: "London",
    destination: "Manchester",
    cargoType: "Chilled food",
    cargoCategory: "REFRIGERATED",
    requiredTrailer: "REFRIGERATED",
    pickupDate: new Date("2026-08-01"),
    deliveryDate: new Date("2026-08-02"),
    budget: 2500,
    currency: "gbp",
    contractTerms: "Carrier must maintain the agreed temperature and provide signed proof of delivery.",
    publish: true,
  };
  assert.equal(contractListingSchema.safeParse(listing).success, true);
  assert.equal(contractListingSchema.safeParse({ ...listing, deliveryDate: new Date("2026-07-31") }).success, false);
  assert.equal(contractListingSchema.safeParse({ ...listing, requiredTrailer: "DUMPER" }).success, false);
  assert.equal(contractBidSchema.safeParse({
    amount: 2200,
    estimatedDays: 2,
    proposal: "Dedicated refrigerated vehicle with live tracking and insured delivery.",
  }).success, true);
});
