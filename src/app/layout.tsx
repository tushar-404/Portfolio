import "./globals.css";
import { FullScreenProvider } from "../context/FullScreenContext";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0 bg-[#FFF1EB]">
        <FullScreenProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <Analytics />
        </FullScreenProvider>
      </body>
    </html>
  );
}
