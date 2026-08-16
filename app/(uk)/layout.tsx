import { SiteShell } from "../components/SiteShell";

export default function UkLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="uk">{children}</SiteShell>;
}
