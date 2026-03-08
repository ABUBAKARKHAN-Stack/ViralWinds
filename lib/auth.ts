import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const key = new TextEncoder().encode(JWT_SECRET);

export const COOKIE_NAME = "admin_token";

export type Session = {
    user: {
        email: string;
        name: string;
        role: "admin";
        image?: string | null;
    };
} | null;

export async function generateToken(payload: { email: string; name: string }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("10d")
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload as { email: string; name: string };
    } catch (error) {
        return null;
    }
}

export async function getAdminSession(): Promise<Session> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const decoded = await verifyToken(token);
    if (!decoded) return null;
    return {
        user: {
            email: decoded.email,
            name: decoded.name,
            role: "admin",
            image: null,
        },
    };
}
