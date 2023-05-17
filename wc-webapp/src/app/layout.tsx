import Sidebar from "@/components/sidebar/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import clsx from "@/helpers/clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wired Chat",
  description: "Welcome to Wired Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "flex w-screen")}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
