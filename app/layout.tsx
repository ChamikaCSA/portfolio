import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { OsRoot } from "@/components/os/ShellRoot";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s · ${profile.osName}`,
  },
  description,
  applicationName: profile.osName,
  authors: [{ name: profile.name, url: profile.links.github }],
  creator: profile.name,
  publisher: profile.name,
  category: "portfolio",
  keywords: [
    "Chamika Abeykoon",
    "Fullstack Developer",
    "Next.js",
    "Flutter",
    "NestJS",
    "Colombo",
    "Software Engineer",
    "Sri Lanka",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#c8f542",
      },
    ],
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_LK",
    siteName: profile.osName,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    title: profile.osName,
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${ibmPlexMono.variable} ${newsreader.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-dvh overflow-hidden overscroll-none bg-bg font-sans text-fg antialiased">
        <JsonLd />
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
