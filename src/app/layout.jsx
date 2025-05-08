import { Khula } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authContextConfig";

const khula = Khula({
  subsets: ["latin"],
  variable: "--font-khula",
  weight: ["300", "400", "600", "700", "800"], // Thin to ExtraBold
});

export const metadata = {
  title: "Shopping App",
  description: "Google apprenticeship interview project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${khula.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
