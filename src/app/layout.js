import "./globals.css";
import { Suspense } from "react"; // <-- Dodaj ta uvoz
import LoadingSpinner from "@/components/LoadingSpinner"; // <-- Uvozi spinner
import MainNavigation from "@/components/layout/MainNavigation";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainNavigation />
       <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
