import { SchedulePage } from "../../../components/SchedulePage";
import { pageMetadata } from "../../../components/SiteShell";
import { getDictionary } from "../../../i18n";

export const metadata = pageMetadata("et", "/schedule");

export default function Page() {
  return <SchedulePage locale="et" dict={getDictionary("et")} />;
}
