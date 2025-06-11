import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FamilyCourse - Диагностика 404',
  description: 'Поиск причины ошибки 404 на главной странице FamilyCourse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
