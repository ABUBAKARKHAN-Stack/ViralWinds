"use client"

import { Session } from "@/lib/auth";
import { errorToast, successToast } from "@/lib/toastNotifications";
import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

export type LoadingStates = 'logout' | "idle"
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
        setLoading("logout")
        try {
            const res = await fetch("/api/admin/logout", { method: "POST" })
            if (res.ok) {
                successToast("Logout Successful!")
                router.push("/auth/signin")
            } else {
                errorToast("Failed To Logout. Try Again")
            }
        } catch (error) {
            errorToast("An error occurred. Try Again")
        } finally {
            setLoading("idle")
        }
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







