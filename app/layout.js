import "./globals.css";

export const metadata = {
  title: "JSON-Filter & Discovery Hub",
  description: "Discover, select, and filter fields from large JSON payloads."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
