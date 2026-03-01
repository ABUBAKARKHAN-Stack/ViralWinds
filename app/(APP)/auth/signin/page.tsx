import { SigninLeftSideImage, Signinform } from "@/components/sections/auth";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account to access your dashboard, and operate securely.",
    robots: {
        index: false,
        follow: false,
    },
};


const SignInPage = () => {


    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <SigninLeftSideImage />
             
            {/* Right Side - Form */}
            <Signinform />

        </div>
    );
};

export default SignInPage;
