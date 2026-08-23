import { JoinPage } from "../../../components/JoinPage";
import { pageMetadata } from "../../../components/SiteShell";
import { getDictionary } from "../../../i18n";

export const metadata = pageMetadata("et", "/join");

export default function Page() {
  return <JoinPage locale="et" dict={getDictionary("et")} />;
}
