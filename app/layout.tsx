import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { OsRoot } from "@/components/os/ShellRoot";
import { profile } from "@/content/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const title = `${profile.name} · Fullstack Developer`;
const description = profile.summary;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#070708" },
  ],
  colorScheme: "dark light",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: title,
    template: `%s · ${profile.osName}`,
  },
  description,
  applicationName: profile.osName,
  authors: [{ name: profile.name, url: profile.links.github }],
  keywords: [
    "Chamika Abeykoon",
    "Fullstack Developer",
    "Next.js",
    "Flutter",
    "NestJS",
    "Colombo",
    "Software Engineer",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${ibmPlexMono.variable} ${newsreader.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-dvh overflow-hidden overscroll-none bg-bg font-sans text-fg antialiased">
        <a
          href="#app"
          className="sr-only focus:not-sr-only focus:absolute focus:top-[max(0.75rem,env(safe-area-inset-top,0px))] focus:left-3 focus:z-70 focus:bg-accent focus:px-3 focus:py-2 focus:text-(--accent-ink)"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <TooltipProvider delayDuration={120}>
            <OsRoot>{children}</OsRoot>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
