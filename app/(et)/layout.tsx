import { SiteShell, siteViewport } from "../components/SiteShell";

export const viewport = siteViewport;

export default function EtLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="et">{children}</SiteShell>;
}
