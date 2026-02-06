/**
 * Authentication utilities for admin dashboard
 */

/**
 * Validates admin password against environment variable
 */
export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return false;
  }
  
  return password === adminPassword;
}

/**
 * Middleware to protect admin API routes
 * Returns Response with 401 if unauthorized, null if authorized
 */
export async function requireAuth(request: Request): Promise<Response | null> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  
  const password = authHeader.replace("Bearer ", "");
  
  if (!validateAdminPassword(password)) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  
  return null; // Auth OK
}
