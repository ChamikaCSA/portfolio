import { Home } from "@/components/apps/Home";
import { JsonLd } from "@/components/seo/JsonLd";

export default function Page() {
  return (
    <>
      <JsonLd />
      <Home />
    </>
  );
}
