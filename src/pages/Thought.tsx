import "src/pages/thought.css";

import Markdown from "@adamjanicki/markdown";
import {
  Box,
  classNames,
  Icon,
  Link,
  ui,
  useScrollToHash,
} from "@adamjanicki/ui";
import transformVfx from "@adamjanicki/ui/components/ui/transformVfx";
import { chevronLeft, chevronRight, link } from "@adamjanicki/ui/icons";
import { Vfx } from "@adamjanicki/ui/types/common";
import React from "react";
import Page from "src/components/Page";
import type { Children, Thought as ThoughtStruct } from "src/types";
import { formatDate, idify } from "src/util";

type Props = {
  thought: ThoughtStruct;
  previous?: string;
  next?: string;
};

type Position = "start" | "middle" | "end";
const justifyMap = {
  start: "end",
  middle: "between",
  end: "start",
} as const;

export default function Thought({ thought, previous, next }: Props) {
  const { title, image, markdown, created, location } = thought;

  let position: Position = "middle";
  if (previous === undefined) {
    position = "start";
  } else if (next === undefined) {
    position = "end";
  }

  useScrollToHash({
    behavior: "smooth",
  });

  return (
    <Page title={title} vfx={{ paddingX: "l" }}>
      <Box
        vfx={{ axis: "y", align: "center", gap: "s" }}
        className="thought-container"
      >
        <ui.h1
          vfx={{ fontWeight: 8, textAlign: "center" }}
          style={{ fontSize: "calc(28px + 1vw)" }}
        >
          {title}
        </ui.h1>
        <ui.img
          src={image}
          vfx={{ radius: "rounded", maxWidth: "full" }}
          style={{ maxHeight: "60vh" }}
          alt=""
        />
        <ui.span vfx={{ color: "muted", fontWeight: 5, width: "full" }}>
          Published {formatDate(created)} in {location}
        </ui.span>
        <Markdown
          className={classNames(
            "markdown-body",
            transformVfx({
              width: "full",
            })
          )}
          renderers={{
            a: ({ children, href }) => <Link to={href}>{children}</Link>,
            blockquote: ({ children }) => (
              <ui.blockquote
                vfx={{
                  padding: "s",
                  marginX: "xs",
                  borderLeft: true,
                  borderWidth: "l",
                  italics: true,
                  fontWeight: 5,
                }}
                {...{ children }}
              />
            ),
            h1: ({ children }) => (
              <IdElementWrapper
                idToStringify={children}
                type="h1"
                vfx={{ fontSize: "l", margin: "none" }}
              >
                {children}
              </IdElementWrapper>
            ),
            h2: ({ children }) => (
              <IdElementWrapper
                idToStringify={children}
                type="h2"
                vfx={{ fontSize: "m", margin: "none" }}
              >
                {children}
              </IdElementWrapper>
            ),
            img: ({ alt, src }) => {
              const youtubeId = getYouTubeId(src);
              return (
                <IdElementWrapper idToStringify={alt} vfx={{ width: "full" }}>
                  <ui.span vfx={{ axis: "y", align: "center", width: "full" }}>
                    {youtubeId ? (
                      <ui.iframe
                        src={`https://youtube.com/embed/${youtubeId}`}
                        vfx={{
                          radius: "rounded",
                          width: "full",
                          maxWidth: "full",
                          border: false,
                        }}
                        style={{
                          maxHeight: "60vh",
                          aspectRatio: "16 / 9",
                          display: "block",
                        }}
                      />
                    ) : (
                      <ui.img
                        src={src}
                        vfx={{ radius: "rounded", maxWidth: "full" }}
                        style={{ maxHeight: "60vh" }}
                        alt=""
                      />
                    )}
                    <ui.em
                      vfx={{
                        color: "muted",
                        fontWeight: 6,
                        textAlign: "center",
                      }}
                    >
                      {alt}
                    </ui.em>
                  </ui.span>
                </IdElementWrapper>
              );
            },
            table: ({ children }) => (
              <IdElementWrapper idToStringify={children}>
                <ui.span
                  vfx={{
                    marginY: "s",
                    width: "full",
                    radius: "rounded",
                    border: true,
                    backgroundColor: "default",
                    overflowX: "auto",
                    lineHeight: "s",
                    shadow: "subtle",
                  }}
                >
                  <ui.table vfx={{ margin: "none" }}>{children}</ui.table>
                </ui.span>
              </IdElementWrapper>
            ),
            tr: (props) => (
              <ui.tr
                vfx={{
                  axis: "x",
                  align: "center",
                  width: "full",
                  padding: "s",
                  borderBottom: true,
                }}
                {...props}
              />
            ),
            th: (props) => (
              <ui.td vfx={{ fontWeight: 7, stretch: "even" }} {...props} />
            ),
            td: (props) => <ui.td vfx={{ stretch: "even" }} {...props} />,
          }}
          inlineExtensions={[
            {
              token: "==",
              intraword: true,
              renderer: (props) => (
                <ui.mark {...props} vfx={{ paddingX: "xxs" }} />
              ),
            },
            {
              token: "^",
              intraword: true,
              renderer: (props) => (
                <ui.sup>
                  <ui.small {...props} vfx={{ fontWeight: 6 }} />
                </ui.sup>
              ),
            },
          ]}
        >
          {markdown}
        </Markdown>
        <Box
          vfx={{
            axis: "x",
            align: "center",
            width: "full",
            justify: justifyMap[position],
          }}
        >
          {previous && (
            <Link
              vfx={{ axis: "x", align: "center", gap: "s" }}
              to={`/${idify(previous, undefined)}`}
            >
              <Icon icon={chevronLeft} /> {previous}
            </Link>
          )}
          {next && (
            <Link
              vfx={{ axis: "x", align: "center", gap: "s" }}
              to={`/${idify(next, undefined)}`}
            >
              {next} <Icon icon={chevronRight} />
            </Link>
          )}
        </Box>
      </Box>
    </Page>
  );
}

function getYouTubeId(url: string) {
  if (typeof url !== "string") return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match ? match[1] : null;
}

function stringifyChildren(children: React.ReactNode): string {
  if (!children) return "";
  if (Array.isArray(children))
    return children.map(stringifyChildren).join(" ").trim();
  if (React.isValidElement(children)) {
    const element = children as React.ReactElement<any>;
    return stringifyChildren(element.props.children);
  }
  return `${children}`.trim();
}

function Octothorpe({ id }: { id: string }) {
  return id ? (
    <Link className="octo" to={`#${id}`}>
      <Icon icon={link} />
    </Link>
  ) : null;
}

type IdElementWrapperProps = {
  children: Children;
  idToStringify: React.ReactNode;
  className?: string;
  vfx?: Vfx;
  type?: "h1" | "h2" | "span";
};

function IdElementWrapper({
  children,
  idToStringify,
  className,
  type = "span",
  vfx,
}: IdElementWrapperProps) {
  const id = idify(stringifyChildren(idToStringify), 10);
  const props = {
    vfx: { axis: "x", align: "center", ...vfx },
    className: classNames("octo-wrapper", className),
    id,
    style: {
      whiteSpace: "pre-wrap",
    },
  } as const;

  const Component = ui[type];

  return (
    <Component {...props}>
      <Octothorpe id={id} />
      {children}
    </Component>
  );
}
