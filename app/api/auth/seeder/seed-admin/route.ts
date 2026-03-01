import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Roles } from "@/types/auth.types";
import { hash } from "bcryptjs";

export const POST = async (request: NextRequest) => {
    try {

        if (process.env.NODE_ENV === "production") {
            return NextResponse.json(
                { message: "Seeder disabled in production" },
                { status: 403 }
            );
        }

        const { secret, name, email, password } = await request.json();

        //* Basic validation
        if (!secret || !email || !password) {
            return NextResponse.json(
                { message: "Secret, email, and password are required." },
                { status: 400 }
            );
        }

        //* Verify secret
        if (secret !== process.env.ADMIN_SEEDER_SECRET) {
            return NextResponse.json(
                { message: "Unauthorized request." },
                { status: 401 }
            );
        }

        //* Hash password
        const hashedPassword = await hash(password, 12);

        const permissions = {
            users: { manage: true, read: true, write: true },
            seo: { manage: true, read: true, write: true },
            content: { manage: true, read: true, write: true },
        };

        //* Create user
        const resp = await auth.api.createUser({
            body: {
                name: name || "Mohsin-Design Admin",
                email,
                password: hashedPassword,
                role: Roles.ADMIN,
                data: { permissions, emailVerified: true },
            },
        });

        return NextResponse.json(
            { message: "Admin user created successfully.", data: resp },
            { status: 201 }
        );

    } catch (error: any) {
        //! Log full error for debugging (server-side only)
        console.error("ADMIN_SEEDER_ERROR:", error);

        if (error?.message) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        //* Fallback error
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
};
