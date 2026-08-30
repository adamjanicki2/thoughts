import "src/pages/thought.css";

import Markdown from "@adamjanicki/markdown";
import {
  Badge,
  Box,
  Button,
  classNames,
  Icon,
  Link,
  ui,
  useScrollToHash,
} from "@adamjanicki/ui";
import transformVfx from "@adamjanicki/ui/components/ui/transformVfx";
import {
  check,
  chevronLeft,
  chevronRight,
  clipboard,
  link,
} from "@adamjanicki/ui/icons";
import { Vfx } from "@adamjanicki/ui/types/common";
import React, { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight as light } from "react-syntax-highlighter/dist/esm/styles/prism";
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
    <Page title={title}>
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
          hideTags={{
            h4: "unwrap",
            h5: "unwrap",
            h6: "unwrap",
          }}
          className={classNames(
            "markdown-body",
            transformVfx({
              width: "full",
            })
          )}
          renderers={{
            a: ({ children, href }) => (
              <Link newTab={isExternal(href)} to={href}>
                {children}
              </Link>
            ),
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
            code: ({ children }) => (
              <ui.code
                children={children}
                style={{
                  color: "darkred",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              />
            ),
            pre: ({ children, lang }) => <CustomPre {...{ children, lang }} />,
            h1: ({ children }) => (
              <IdElementWrapper
                idToStringify={children}
                type="h1"
                vfx={{ fontSize: "xl", margin: "none" }}
              >
                {children}
              </IdElementWrapper>
            ),
            h2: ({ children }) => (
              <IdElementWrapper
                idToStringify={children}
                type="h2"
                vfx={{ fontSize: "l", margin: "none" }}
              >
                {children}
              </IdElementWrapper>
            ),
            h3: ({ children }) => (
              <IdElementWrapper
                idToStringify={children}
                type="h3"
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
            hr: () => (
              <ui.hr
                style={{
                  height: "3px",
                  border: "none",
                  backgroundColor: "#ccc",
                }}
              />
            ),
            table: ({ children }) => (
              <IdElementWrapper idToStringify={children}>
                <ui.span
                  vfx={{
                    marginY: "s",
                    width: "full",
                    radius: "rounded",
                    border: true,
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
  type?: "h1" | "h2" | "h3" | "span";
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

function isExternal(href: string) {
  return !(href.startsWith("#") || href.startsWith("/"));
}

type PreProps = {
  children: React.ReactNode;
  lang?: string;
};

function CustomPre({ children, lang }: PreProps) {
  const [copied, setCopied] = useState(false);
  const timeOutRef = useRef<number>(null);
  const code = stringifyChildren(children).trim();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(() => setCopied(false), 3000) as any;
  };

  return (
    <Box
      vfx={{
        width: "full",
        radius: "rounded",
        marginY: "m",
        border: true,
        backgroundColor: "default",
        shadow: "floating",
      }}
    >
      <Box
        vfx={{
          axis: "x",
          align: "center",
          justify: "between",
          borderBottom: true,
          paddingX: "s",
          paddingY: "xs",
        }}
      >
        <ui.span vfx={{ fontSize: "s", fontWeight: 5 }}>
          {lang || "unknown"}
        </ui.span>
        {copied ? (
          <Badge vfx={{ axis: "x", align: "center", gap: "xs" }} type="success">
            <Icon icon={check} /> Copied
          </Badge>
        ) : (
          <Button
            vfx={{ axis: "x", align: "center", gap: "xs", paddingY: "xxs" }}
            onClick={copyCode}
            size="small"
            variant="secondary"
          >
            <Icon icon={clipboard} />
            Copy
          </Button>
        )}
      </Box>
      <ui.pre
        vfx={{
          axis: "x",
          margin: "none",
          overflow: "auto",
          padding: "s",
          width: "full",
        }}
        style={{ maxHeight: "70vh" }}
      >
        <SyntaxHighlighter
          style={light}
          language={lang || "text"}
          customStyle={{
            background: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
          }}
          className="no-bg"
        >
          {code}
        </SyntaxHighlighter>
      </ui.pre>
    </Box>
  );
}
