import { SiteShell } from "../components/SiteShell";

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
