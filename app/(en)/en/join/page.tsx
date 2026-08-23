import { JoinPage } from "../../../components/JoinPage";
import { pageMetadata } from "../../../components/SiteShell";
import { getDictionary } from "../../../i18n";

export const metadata = pageMetadata("en", "/join");

export default function Page() {
  return <JoinPage locale="en" dict={getDictionary("en")} />;
}
