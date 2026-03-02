import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import RootProvider from "@/provider/RootProvider";
import { APP_NAME, BASE_URL, BRAND_DESCRIPTION, TAGLINE } from "@/constants/app.constants";


const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ]
})

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700"
  ]
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${TAGLINE} | ${APP_NAME}`,
    template: `%s | ${APP_NAME}`,
  },
  description: BRAND_DESCRIPTION,

  icons: {
    icon: {
      url: "/assets/favicon.png",
      type: "image/png",
      sizes: "any",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${display.variable} font-sans antialiased`}
      >
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
