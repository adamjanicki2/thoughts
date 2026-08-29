import { Link, ui } from "@adamjanicki/ui";
import Page from "src/components/Page";
import thoughts from "src/thoughts";
import { idify } from "src/util";

export default function Home() {
  return (
    <Page title="Thoughts" vfx={{ padding: "m" }}>
      <ui.ol>
        {thoughts.map((thought, i) => (
          <ui.li key={i} vfx={{ fontSize: "m", fontWeight: 5 }}>
            <Link to={idify(thought.title, undefined)}>{thought.title}</Link>
          </ui.li>
        ))}
      </ui.ol>
    </Page>
  );
}
