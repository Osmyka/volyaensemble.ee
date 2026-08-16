import { SiteShell } from "../components/SiteShell";

export default function EtLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="et">{children}</SiteShell>;
}
