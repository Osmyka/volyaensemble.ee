import { SiteShell, siteViewport } from "../components/SiteShell";

export const viewport = siteViewport;

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
