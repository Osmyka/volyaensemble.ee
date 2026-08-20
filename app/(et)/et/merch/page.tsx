import { MerchPage } from "../../../components/MerchPage";
import { pageMetadata } from "../../../components/SiteShell";
import { getDictionary } from "../../../i18n";

export const metadata = pageMetadata("et", "/merch");

export default function Page() {
  return <MerchPage locale="et" dict={getDictionary("et")} />;
}
