import {
    ResetPasswordFallback,
    ResetPasswordForm,
    ResetPasswordLeftSideImage
} from "@/components/sections/auth";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset your account password securely and regain access to your account in just a few steps.",
    robots: { index: false, follow: false }
}

interface Props {
    searchParams: Promise<{ token: string | undefined }>;
}

const ResetPasswordPage = async (
    {
        searchParams
    }: Props
) => {

    const { token } = await searchParams;

    //! Invalid Token Fallback 
    if (!token) return <ResetPasswordFallback />


    return (
        <div className="min-h-screen flex">

            {/* Left Side - Image */}
            <ResetPasswordLeftSideImage />

            {/* Right Side - Form */}
            <ResetPasswordForm token={token} />

        </div>
    );
};

export default ResetPasswordPage;
