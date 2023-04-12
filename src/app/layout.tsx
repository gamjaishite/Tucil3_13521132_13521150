import "./globals.css";
import localFont from "next/font/local";

const fisaCodeFont = localFont({
    src: "../public/fonts/Fisa Code Book Regular.ttf",
    weight: "400",
    style: "normal",
    variable: "--font-fisa",
});

export const metadata = {
    title: "Find Route",
    description: "Find Route",
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
