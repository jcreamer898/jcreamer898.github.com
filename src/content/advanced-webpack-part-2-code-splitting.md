---
draft: false
layout: post
title: Advanced WebPack Part 2 - Code Splitting
image: img/post.jpg
author: Jonathan Creamer
date: 2016-01-10
tags: 
  - webpack
  - plugin
  - package
  - advanced
  - code splitting
  - lazy load
  - import
---

WebPack has a feature that utilizes the AMD spec called [Code Splitting](https://webpack.github.io/docs/code-splitting.html). What it allows you to do is "split your code" (insert troll face).

Seriously, it's an amazing feature. What generally happens when you work with a standard WebPack build is, you'll have a few entry points like...

```js
entry: {
  home: "js/home",
  tools: "js/tools",
  common: ["jquery", "kendo"]
},
plugins: [new CommonsChunkPlugin({ name: "common" })]
```

With a setup like this, you'll potentially end up with 3 files, `home.js`, `tools.js`, and `common.js`. This might work perfectly for you. 

However, if you're working with some sort of very large Web App, or you're wanting to split out your code into the "above the fold" vs "below the fold" code, it would be nice to further split out your output files.

This is what you can utilize Code Splitting to accomplish.

### Critical Path

Page load speed is an extremly important metric for user happiness, let alone SEO, so let's take the above the fold example. There are great tools out there for determining how quickly your site renders including [Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/), [WebPageTest](webpagetest.org), and even Chrome's native developer tools have a preview of your site's load time.

![](http://d.pr/i/zYks+)

Ideally your site will show *something* to the user within 2 seconds so that they are not tempted to leave early and increase your site's bounce rate. Even if the ENTIRE page isn't rendered, you need to get something to the user as quickly as you can.

There are a few tools for helping you do this such as Addy Osmani's [critical](https://github.com/addyosmani/critical), and Scott Jehl/FilamentGroup's [CriticalCSS](https://github.com/filamentgroup/criticalCSS).

With WebPack's code splitting though, you can actually create a setup where you're able to generate an above the fold and below the fold set of bundles.

Our new design's at Lonely Planet have a really nice new masthead, and navigation which is what the user sees above the fold. We've architected our JavaScript, and SASS in such a way that we are able to know precicely which modules are needed to render that content...

![](http://d.pr/i/133ur+)

I know that we need our Navigation, Search, Masthead, and SubNav components to be included above the fold.

```js
import Masthead from "rizzo-next/src/components/masthead";
import rizzo from "rizzo-next";
import "./main";
// ...
require.ensure([
  "./below_the_fold"
], function(require) {
  // Now require it "sync"
  require("./below_the_fold");
}, "below_the_fold");
```

So, in the entry point of our JS, we include all those components bundled below in `./main`.

Then we introduce the code splitting. You can use `require.ensure` to create a "split point" in your code. We have a file called `below_the_fold.js` which import's all the modules that we know appear below the fold. `require.ensure` can also take a 3rd optional argument to name the "chunk" that get's output...

![](http://d.pr/i/1lkRC+)

Also, since my `continents.js`, `countries.js`, and `cities.js` files are all including the same `main.js` file, they will get pulled into the `common.js` file thanks to the `CommonChunksPlugin` that was talked about in [Part 1](http://jonathancreamer.com/advanced-webpack-part-1-the-commonschunk-plugin/) of this series! 

### Splitting up your app
You can also utilize code splitting to simply split up your application into smaller chunks that you can load on demand. You can even split the code up and load it dynamically with some type of event handler...

```js
let map;
$mapButton.on("click", function() {
  if (!mapLoaded) {
    require.ensure([
      "../map/index"
    ], (require) => {
      if (map) {
        return map.open();
      }

      let MapComponent = require("../map/index");
      
      map = new MapComponent({
        el: ".map_holder"
      });
      
      map.open();
    }, "map");
  }
});
```

WebPack will create a bundle called "map" in the output, but it will not actually try to load the bundle until the button is clicked!

This is extremely useful for us at Lonely Planet because we're using React for our map. This means we can make sure to not include React when the page initially loads, but we can defer that load until the user actually wants to interact with the map.

You could apply the principal to any component you may not need initially when your page loads but can be triggered by some sort of user interaction.

Feel free to check out my Nodevember talk where I covered this and several more advanced webpack topics!

<iframe width="560" height="315" src="https://www.youtube.com/embed/MzVFrIAwwS8" frameborder="0" allowfullscreen></iframe>
