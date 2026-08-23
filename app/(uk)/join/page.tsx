import { JoinPage } from "../../components/JoinPage";
import { pageMetadata } from "../../components/SiteShell";
import { getDictionary } from "../../i18n";

export const metadata = pageMetadata("uk", "/join");

export default function Page() {
  return <JoinPage locale="uk" dict={getDictionary("uk")} />;
}
