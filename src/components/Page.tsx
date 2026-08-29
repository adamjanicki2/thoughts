import Box, { type BoxProps } from "@adamjanicki/ui/components/Box/Box";
import { useEffect } from "react";

type Props = BoxProps & {
  title: string;
};

export default function Page({ title, vfx, style, ...rest }: Props) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Box
      {...rest}
      vfx={{
        axis: "y",
        align: "center",
        width: "full",
        ...vfx,
      }}
      style={{ minHeight: "70vh", ...style }}
    />
  );
}
