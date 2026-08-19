import { Home } from "@/components/surfaces/Home";
import { JsonLd } from "@/components/seo/JsonLd";

export default function Page() {
  return (
    <>
      <JsonLd />
      <Home />
    </>
  );
}
