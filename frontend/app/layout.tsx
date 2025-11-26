import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FormProvider } from "./contexts/FormContext";
import { PageTransitionProvider } from "./components/PageTransition";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import FormModals from "./components/FormModals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple and clean personal task manager application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <FormProvider>
            <SidebarProvider>
              <PageTransitionProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 lg:ml-0">{children}</main>
                  </div>
                  <Footer />
                </div>
                <FormModals />
              </PageTransitionProvider>
            </SidebarProvider>
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
