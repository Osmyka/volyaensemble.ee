import { HomePage } from "../../components/HomePage";
import { pageMetadata } from "../../components/SiteShell";
import { getDictionary } from "../../i18n";

export const metadata = pageMetadata("et", "/");

export default function Page() {
  return <HomePage locale="et" dict={getDictionary("et")} />;
}
