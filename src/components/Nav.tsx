import "src/components/nav.css";

import { Icon, ui, UnstyledLink } from "@adamjanicki/ui";
import { architect } from "@adamjanicki/ui/icons";

export default function Nav() {
  return (
    <ui.nav vfx={{ paddingY: "s", paddingX: "l" }}>
      <UnstyledLink to="/">
        <Icon icon={architect} size="l" />
      </UnstyledLink>
    </ui.nav>
  );
}
