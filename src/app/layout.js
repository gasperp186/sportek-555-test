import "./globals.css";

import MainNavigation from "@/components/layout/MainNavigation";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainNavigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
