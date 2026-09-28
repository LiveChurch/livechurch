import { LocaleRedirect } from "@/components/layout/LocaleRedirect";

/** Root address: sends the person to the page in the browser's language. */
export default function RootPage() {
  return <LocaleRedirect />;
}
