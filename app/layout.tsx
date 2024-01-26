import type { Metadata } from "next";
import AuthContext from "@/context/AuthContext";
import NextTopLoader from "nextjs-toploader";
import { ModalProvider } from "@/providers/modalProviders";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "CodeCollab",
  description:
    "CodeCollab Hub is a collaborative coding platform where users can create virtual rooms, code together in real-time using an integrated IDE, and brainstorm ideas on a shared blackboard. It's the ultimate space for seamless teamwork, fostering innovation through joint coding sessions and interactive idea exchange.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="code-collab"
          >
            <Toaster richColors />
            <NextTopLoader showSpinner={false} crawl={false} />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  );
}
