import '../styles/globals.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExpandableChatDemo } from "@/components/ExpandableChatDemo";

export const metadata = {
  title: 'Ethan Protfolio',
  description: 'Ethan Protfolio using Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to set the theme before rendering to avoid flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var dark = saved === 'dark' || (!saved && prefersDark);
                  if (dark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        {children}
        <ExpandableChatDemo />
        <Footer />
      </body>
    </html>
  )
}
