import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import matter from "gray-matter";

import type { Thought } from "./src/types";

const ENTRIES_DIR = path.resolve("entries");
const VIRTUAL_MODULE_ID = "virtual:thoughts";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

function loadThoughts(): Thought[] {
  const files = fs
    .readdirSync(ENTRIES_DIR)
    .filter((file) => file.endsWith(".md"));

  return files.map((file) => {
    const filePath = path.join(ENTRIES_DIR, file);
    const source = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(source);

    const { title, image, created, location } = data;

    if (!title || !image || !created || !location) {
      throw new Error(`Missing required frontmatter in ${file}`);
    }

    return {
      title,
      image,
      created,
      location,
      markdown: content,
    };
  });
}

export function transformMarkdown(): Plugin {
  return {
    name: "thoughts",

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export const thoughts = ${JSON.stringify(loadThoughts())};`;
      }
    },
  };
}
