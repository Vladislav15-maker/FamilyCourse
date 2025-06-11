import type { Metadata } from 'next';
import './globals.css'; // Keep globals.css for basic styling

export const metadata: Metadata = {
  title: 'FamilyCourse Diagnostics',
  description: 'Troubleshooting FamilyCourse 404',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Font links temporarily removed for diagnostics */}
      </head>
      <body> {/* Removed custom font classes, AppProvider, and Toaster for diagnostics */}
        {children}
      </body>
    </html>
  );
}