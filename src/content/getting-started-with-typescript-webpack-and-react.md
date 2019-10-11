---
draft: false
layout: post
title: Getting started with TypeScript, WebPack, and React
image: img/messagetsx.png
author: Jonathan Creamer
date: 2017-09-17
tags: 
  - react
  - webpack
  - typescript
---

We've been integrating TypeScript more and more into our workflow at Lonely Planet.

I wanted to just quickly share how easy it is to get started working with TypeScript and Webpack! 

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZyoVZ6cLvpI" frameborder="0" allowfullscreen></iframe>

It takes a very simple webpack.config...

```js
module.exports = {
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    filename: "./dist/bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader"
    }],
  },
};
```

And a few `npm install`s...

```json
"devDependencies": {
  "@types/react": "^16.0.5",
  "@types/react-dom": "^15.5.4",
  "react": "^15.6.1",
  "react-dom": "^15.6.1",
  "ts-loader": "^2.3.4",
  "typescript": "^2.5.2",
  "webpack": "^3.5.5",
  "webpack-dev-server": "^2.7.1"
}
```

Then start writing TypeScript and React!

Full code of the starter at https://github.com/jcreamer898/typescript-webpack-react.
