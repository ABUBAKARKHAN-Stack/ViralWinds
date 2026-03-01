"use client"

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { errorToast, successToast } from "@/lib/toastNotifications";
import { LoadingStates } from "@/types/auth.types";
import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useState } from "react";

interface SessionContextType {
    session: Session;
    logout: () => Promise<void>;
    loading: LoadingStates;

}
const SessionContext = createContext<SessionContextType | undefined>(undefined);


export function SessionProvider({
    children,
    session
}: { children: ReactNode, session: Session }) {

    const [loading, setLoading] = useState<LoadingStates>("idle")
    const router = useRouter()


    const logout = async () => {
        await authClient.signOut(
            {},
            {
                onRequest(_context) {
                    setLoading("logout")
                },
                onSuccess(_context) {
                    successToast("Logout Successful!")
                    router.push("/auth/signin")
                },
                onError(context) {
                    const errMsg = context.error.message || "Failed To Logout. Try Again"
                    errorToast(errMsg)
                },
                onResponse(_context) {
                    setLoading("idle")
                },
            }
        )
    }


    return (
        <SessionContext.Provider value={{
            session,
            loading,
            logout,
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}







