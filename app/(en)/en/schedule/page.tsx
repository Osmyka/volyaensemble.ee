import { SchedulePage } from "../../../components/SchedulePage";
import { pageMetadata } from "../../../components/SiteShell";
import { getDictionary } from "../../../i18n";

export const metadata = pageMetadata("en", "/schedule");

export default function Page() {
  return <SchedulePage locale="en" dict={getDictionary("en")} />;
}
