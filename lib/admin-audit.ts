import { AdminRole } from "@prisma/client";

export function logAdminAuditEvent(input: {
  event: string;
  status: "success" | "failure";
  userId?: string;
  email?: string;
  role?: AdminRole;
  route?: string;
  reason?: string;
}) {
  console.info("[admin_audit_event]", {
    ts: new Date().toISOString(),
    ...input,
  });
}
