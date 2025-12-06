import type { Metadata } from "next";
import "./main.css";
import "./noscript.css";
import InitClient from "./InitClient";

export const metadata: Metadata = {
  title: "Cloudwired",
  description: "Cloudwired - Personal Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="is-preload" suppressHydrationWarning>
        <InitClient />
        {children}
      </body>
    </html>
  );
}
