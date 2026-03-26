import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Haroon Mubeen',
  description: 'Full Stack Engineer specializing in Node.js, NestJS, and Next.js.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    ink:   '#0A0A0A',
                    paper: '#F5F0E8',
                    rust:  '#C4441A',
                    amber: '#E8A020',
                    mist:  '#8A8A7A',
                    cream: '#EDE8DC',
                  },
                  fontFamily: {
                    display: ['"Playfair Display"', 'serif'],
                    body:    ['"DM Sans"', 'sans-serif'],
                    mono:    ['"IBM Plex Mono"', 'monospace'],
                  },
                }
              }
            }
          `
        }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
