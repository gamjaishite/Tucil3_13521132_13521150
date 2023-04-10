import "./globals.css";
import localFont from "next/font/local";

const fisaCodeFont = localFont({
  src: "../public/fonts/Fisa Code Book Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-fisa",
});

export const metadata = {
  title: "The Zuta",
  description: "The Zuta Path Finding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fisaCodeFont.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
