import "./globals.css";

export const metadata = {
  title: "Portfolio Manager",
  description: "Next.js frontend for Flask portfolio API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}