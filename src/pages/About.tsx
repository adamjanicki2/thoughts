import { ui } from "@adamjanicki/ui";
import Page from "src/components/Page";

export default function About() {
  return (
    <Page title="About">
      <ui.p
        vfx={{
          paddingX: "l",
          fontSize: "m",
          fontWeight: 5,
          color: "muted",
          textAlign: "center",
        }}
      >
        This is an example page. You can edit this page in{" "}
        <ui.code>src/pages/About.tsx</ui.code>
      </ui.p>
    </Page>
  );
}
