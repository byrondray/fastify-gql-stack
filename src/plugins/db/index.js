"use strict";

import fp from "fastify-plugin";
import { randomUUID } from "crypto";

export const tags = [
  { id: "a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0", name: "coding" },
  { id: randomUUID(), name: "music" },
  { id: randomUUID(), name: "finance" },
  { id: randomUUID(), name: "education" },
  { id: randomUUID(), name: "travel" },
];

const tagsMap = tags.reduce((acc, tag) => {
  acc[tag.name] = tag;
  return acc;
}, {});

export const posts = [
  {
    id: "a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0",
    title: "Why I love GraphQL",
    content: "End to End Typesafety is great.",
    tag: tagsMap["coding"],
  },
  {
    id: "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1",
    title: "How to write a song",
    content: "Study music theory or have a natural ear for it.",
    tag: tagsMap["music"],
  },
  {
    id: "c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2",
    title: "How to travel the world",
    content: "Start planning early and make sure you save up enough money",
    tag: tagsMap["finance"],
  },
  {
    id: "d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3",
    title: "How to travel to Asia",
    content:
      "Do research on which area in Asia you want to visit (ex - India, China, etc), and learn a bit of the local language, perhaps with Duolingo",
    tag: tagsMap["education"],
  },
  {
    id: "e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4",
    title: "How to travel to Iceland",
    content:
      "Traveling to Iceland is really cool, be sure to bring a good jacket or rent one while visiting.",
    tag: tagsMap["travel"],
  },
];

const db = {
  posts,
  tags,
};

const DbPlugin = fp(function DbPlugin(fastify, opts, next) {
  fastify.log.info("Database loading...");
  fastify.decorate("db", db);
  fastify.log.info("Database loaded!");
  next();
});

export default DbPlugin;
