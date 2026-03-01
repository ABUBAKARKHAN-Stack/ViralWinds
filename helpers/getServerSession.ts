import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
export async function getServerSession() {

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    
    return session;
  } catch (error) {

    
    console.error("Better Auth session failed:", error);
    return null;
  }
}
