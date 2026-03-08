import { ADMIN_NAME } from "@/constants/app.constants";
import { COOKIE_NAME, generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
            return NextResponse.json(
                { message: "Admin credentials not configured" },
                { status: 500 }
            );
        }

        if (email !== adminEmail) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash);



        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = await generateToken({ email, name: ADMIN_NAME });

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        return NextResponse.json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
