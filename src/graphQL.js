"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
    tag: Tag!  
  }

  type Tag {
    id: ID!
    name: String!
    posts: [Post!]!  
  }

  input PostCreate {
    title: String!
    content: String!
    tagId: ID!  
  }

  input PostUpdate {
    id: ID!
    title: String
    content: String!
    tagId: ID!  
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getTags: [Tag!]!
    getPostsByTag(tagId: ID!): [Post!]!
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!): Post
    updatePost(updatePost: PostUpdate): Post!
    createTag(name: String!): Tag!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
    getTags: (_parent, args, { app }) => {
      return app.db.tags;
    },
    getPostsByTag: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.tags.find((tag) => {
        tag.id === id;
      });
    },
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content, tagId } = newPost;
      const tag = app.db.tags.find((tag) => tag.id === tagId);
      if (!tag) throw new Error("Tag not found");

      const post = {
        id: randomUUID(),
        title,
        content,
        tag,
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, { id }, { app }) => {
      const postIndex = app.db.posts.findIndex((post) => post.id === id);
      if (postIndex === -1) throw new Error("Post not found");

      const [deletedPost] = app.db.posts.splice(postIndex, 1);
      return deletedPost;
    },
    updatePost: (_parent, { updatePost }, { app }) => {
      const { id, title, content, tagId } = updatePost;
      const postIndex = app.db.posts.findIndex((post) => post.id === id);
      if (postIndex === -1) throw new Error("Post not found");

      const post = app.db.posts[postIndex];
      if (title !== undefined) {
        post.title = title;
      }
      post.content = content;
      if (tagId) {
        const tag = app.db.tags.find((tag) => tag.id === tagId);
        if (!tag) throw new Error("Tag not found");
        post.tag = tag;
      }

      app.db.posts[postIndex] = post;
      return post;
    },
    createTag: (_parent, { name }, { app }) => {
      const tag = {
        id: randomUUID(),
        name,
      };
      app.db.tags.push(tag);
      return tag;
    },
  },
};

export const loaders = {};
