import { MerchPage } from "../../components/MerchPage";
import { pageMetadata } from "../../components/SiteShell";
import { getDictionary } from "../../i18n";

export const metadata = pageMetadata("uk", "/merch");

export default function Page() {
  return <MerchPage locale="uk" dict={getDictionary("uk")} />;
}
