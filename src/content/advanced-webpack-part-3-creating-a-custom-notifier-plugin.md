---
draft: false
layout: post
title: Advanced WebPack Part 3 - Creating a custom notifier plugin
image: img/post.jpg
author: Jonathan Creamer
date: 2016-06-08
tags: 
  - webpack
  - plugin
  - package
---

As a front end infra engineer, you'll use the heck out of WebPack. It's an incredibly powerful tool.

Sometimes it takes a while though. I decided today that rather than watching the command line while it compiles to know when I'm good to refresh the browser, I'd just learn how to write a plugin to notify me about it.

Turns out it's pretty darn simple.

```js
// ./notifier.js
"use strict";

class Notifier {
  apply(compiler) {
    compiler.plugin("done", (stats) => {
      const pkg = require("./package.json");
      const notifier = require("node-notifier");
      const time = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

      notifier.notify({
        title: pkg.name,
        message: `WebPack is done!\n${stats.compilation.errors.length} errors in ${time}s`,
        contentImage: "https://path/to/your/logo.png",
      });
    });
  }
}

module.exports = Notifier;
```

Any `class` or `function` or even `object` with an `apply` function defined will automtically recieve an instance of the WebPack [Compiler](https://github.com/webpack/webpack/blob/master/lib/Compiler.js).

You can then hook into one of many different [lifecycle events](https://webpack.github.io/docs/plugins.html).

Then in your `webpack.config.js`...

```js
const Notifier = require("./notifier");

// ...
{
  plugins: [new Notifier()]
}  
```

There's a whole lot of cool things you can do by creating your own WebPack plugins!
