---
draft: false
layout: post
title: Advanced WebPack Part 1 - The CommonsChunk Plugin
image: img/post.jpg
author: Jonathan Creamer
date: 2015-09-01
tags: 
  - webpack
  - plugin
  - CommonsChunk
  - advanced
---
> "As a front end developer, I want to split my assets up into multiple bundles so that I can load only the JavaScript, and CSS needed for a page"

For as long as I can remember in my career as a front end developer, one of the problems I've constantly been faced with was how to properly bundle assets for multi-page applications. There are many approaches to solving this problem, and it seems right now the most common one is to bundle CSS, and JavaScript separately and each into a single file.

Generally through grunt, or gulp, all the CSS (SASS, LESS, etc) and JavaScript each get combined together into separate files, minified, and sent down the client. This is a very good solution to the problem at hand, but there are a few tweaks that I think can help improve things.

Some issues of this solution are: 

* There's only 1 file for ALL the CSS in your app
* A larger initial download can slow the time to render your site
* Unless you load asynchronously, these large files block downloading

Enter WebPack.

## WebPack
WebPack is a bundler for front end assets. It can bundle lots of things. Not only just JavaScript and CSS either. It can do images, html, coffeescript, typescript, etc. It does this through the use of "loaders". A loader will allow you to target a specific file extension and pass it through that loader.

### Multiple Entries for multi-page
Install WebPack as a global node.js module with..

```js
npm install -g webpack
```

Now create a `webpack.config.js` file

```js
module.exports = {
  entry: {
    "home": "js/home",
    "list": "js/list",
    "details": "js/details"
  }
};
```

```
js/home/index.js
js/home/home.scss
js/list/index.js
js/list/list.scss
js/details/index.js
js/details/details.scss
```

Here we'll have 3 pages. A good way to organize things is to put each of these into separate folders...

Let's add the [babel-loader](github.com/babel/babel-loader) to webpack so we can use ES2015 modules and classes...


```js
loaders: [{
  test: /*.js$/,
  exclude: /node_modules/,
  loader: "babel"
}]
```

Now let's create a few components to use across our pages. Similar to the page organzation, you can create a folder for components, and one for each component...

```
js/components/
js/components/header/index.js
js/components/header/header.scss
js/components/search/index.js
js/components/search/search.scss
...
...
```

This type of organization will allow you to keep all the code for a given component in the same place.

Then the code JS code for a module can look like this...

```js
// components/search/index

import "search.scss"; // WAT

export default class Search {
  constructor({ el }) {
    this.$el = el;
    this.$el.on("focus", ".search__input", this.searchActivate.bind(this));
  }
  searchActivate() {
    // ...
  }
}
```

Our header might then import the search component, and it's styles

```js
import "header.scss";
import Search from "../search";

export default class Header {
  constructor({ el }) {
    this.$el = el;
    
    this.search = new Search({
      el: this.$el.find(".search")
    });
  }
}
```

The search, and header are components that each page would need, so let's import them into each one of our pages...

```js
import "home.scss";
import Header from "../components/header";

const header = new Header({ el: ".header" });
```

Here's what's great about WebPack, it would seem like since we've used the same module 3 times that when we build the bundle, we'd see it repeated 3 times. That's where WebPack plugins come into play.

### WebPack Plugins
There are bunches of different [plugins](http://webpack.github.io/docs/list-of-plugins.html) for WebPack. 

One of the coolest ones is the CommonsChunk plugin. WebPack defines each module of your code as a "chunk". The job of the CommonsChunk plugin is to determine which modules (or chunks) of code you use the most, and pull them out into a separate file. That way you can have a common file that contains both CSS and JavaScript that every page in your application needs.

To get started...

```js
var CommonsPlugin = new require("webpack/lib/optimize/CommonsChunkPlugin")

// ...

module.exports = {
  entry: {
    common: ["jquery"]
  },
  plugins: [
    new CommonsPlugin({
      minChunks: 3,
      name: "common"
    });
  ]
};
```
Require the plugin into your webpack.config file, then add a new `common` entry. You can preload the common chunk with stuff like jQuery that you may want on every page.

You then need to create an instance of the plugin down in an array of plugins. You can specify the `minChunk` option in here as well. This option says, if any module is used X or more times, then take it out and pull it into the common chunk. The `name` must match with the key in the `entry` object.

Now the next time you run WebPack, you'll have another outputed chunk that contains jQuery as well as any module that you have used 3 or more times. So our header that we've used in every page would be pulled out into the common chunk.

### Conclusion
It's always been a challenge to determine what pages need what JavaScript and styles. Thankfully WebPack's CommonsChunk plugin makes it pretty simple to do this out of the box with just a bit of configuration. 

This is part 1 of Advanced Webpack. There will be more to come!

Be sure and check out the [webpack express starter](https://github.com/jcreamer898/webpack-express-starter) repository which will have some examples of things talked about throughout the series. 
