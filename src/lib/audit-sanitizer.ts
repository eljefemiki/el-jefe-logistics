const sensitiveKey = /(password|secret|token|authorization|cookie|session)/i;

export function sanitizeAuditValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeAuditValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        sensitiveKey.test(key) ? "[REDACTED]" : sanitizeAuditValue(child),
      ]),
    );
  }
  return value;
}
