---
draft: false
layout: post
title: How webpack decides what entry to load from a package
# image: img/testimg-cover.jpg
author: Jonathan Creamer
date: 2018-09-30T07:03:47.149Z
tags: 
  - webpack
  - entry
  - package
---

Today I was working on creating a node.js bundle using webpack 4, and came across a fun little doozie of an error which lead me to do a bit of code spelunkery into how Webpack actually decides on what to load when you `require` something from `node_modules`.

Most `package.json` files have a `main` in them, because it tells the "requirer" of the package what the entry point of the package is.

> The main field is a module ID that is the primary entry point to your program. https://docs.npmjs.com/files/package.json#main

Well, there's also a spec for defining other targets, namely the "browser" field.

https://docs.npmjs.com/files/package.json#browser

There is even a proposal to add a "module" field. https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md, which some libraries are already taking advantage of, and Webpack can also understand it.

In terms of Webpack, the 3 most important ones are `main`, `browser`, and `module`. 

* `browser` should point to a browser compatible bundle
* `module` should point to a folder of ES modules
* `main` should point to whatever whatever you want the default entry to be

If the `target` of your app is `web` or a few others (which is default). It will look first at the `browser` field, and if it doesn't exist, it'll look for the `module`, and lastly `main`.

```
if (
    options.target === "web" ||
    options.target === "webworker" ||
    options.target === "electron-renderer"
) {
    return ["browser", "module", "main"];
} else {
    return ["module", "main"];
}
```

https://github.com/webpack/webpack/blob/52184b897f40c75560b3630e43ca642fcac7e2cf/lib/WebpackOptionsDefaulter.js#L336.

If your package is simply only meant to work in the browser, you can get away with only using `main`, but if you're looking to support both the web and node, then take advantage of the `browser` field by pointing it to your browser compatible bundle.

For me what was happening was, there's an import in one of our libraries for `isomorphic-fetch`. Well, since the target is `node` in the Webpack build I was working with, `node-fetch` actually got required. And `node-fetch` requires a library which can't be lazily loaded by Webpack. Aka this issue. https://github.com/andris9/encoding/issues/18. 

**tldr; if your Webpack target is `node`, it looks at the `module` and `main` for entry. Otherwise, it goes to the `browser`, then `module`, then `main`.**

