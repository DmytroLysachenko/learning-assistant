import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

const outfit = localFont({
  src: [
    {
      path: "../public/fonts/Outfit-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Language Assistant",
  description: "Your AI-powered language learning companion",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${outfit.className} ${inter.className} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
        />
      </body>
    </html>
  );
};

export default RootLayout;
