import { SiteShell, siteViewport } from "../components/SiteShell";

export const viewport = siteViewport;

export default function UkLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="uk">{children}</SiteShell>;
}
