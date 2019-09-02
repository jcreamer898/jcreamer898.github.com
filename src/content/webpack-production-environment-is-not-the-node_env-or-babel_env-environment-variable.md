---
draft: false
layout: post
title: WebPack production environment is NOT the NODE_ENV or BABEL_ENV environment variable
image: img/testimg1.jpg
author: Jonathan Creamer
date: 2018-09-30T07:03:47.149Z
tags: 
  - webpack
  - babel
  - node
---

A revelation came to me the other day when I was reviewing some of our bundling processes at Eventbrite.

We currently run production bundles like this...

```bash
node --max_old_space_size=4096\
 ./node_modules/.bin/webpack \
 --bail \
 --config-name node \
 --env.production \
 --config ./config/webpack.production.config.js        
```

Notice the `--env.production` in there. 

We also use the `babel-loader` along with the `babel-preset-env` plugin as any good citizen would.

Here's what's interesting.

> `--env.production` does NOT set `NODE_ENV=production`

I proceeded to hover over the `environment` key on my .babelrc in VSCode, and got this little nugget.

![](https://d.pr/i/VbEYd6+)

I then found the exact quote from the old [62.6 docs](https://babeljs.io/docs/en/6.26.3/babelrc#env-option) (we're still on Babel 6 for now).

> The env key will be taken from process.env.BABEL\_ENV, when this is not available then it uses process.env.NODE\_ENV if even that is not available then it defaults to "development".

Alright so basically that means we've been running Babel as dev mode! 

![](img/doh.gif)

What does that `--env.production` thing even do?

Well, according to https://webpack.js.org/guides/environment-variables, all it does is make it so when you setup your webpack config, you actually export a function that gives you an `env`, and evidently you can also set your actual NODE_ENV like...

```js
webpack --env.NODE_ENV=local --env.production --progress
```

Then you you can get that `env` in the config callback.

```js
module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true
```

### DefinePlugin
Here's the thing though, just running `NODE_ENV=production webpack` doesn't necessarily give you production bundles either. 

`NODE_ENV=production` just tells node in what mode to actually run webpack. 

Meaning, if you have code in your app which does...

```js
if (process.env.NODE_ENV === 'production') {
  // do production things
}
```

It will simply leave those in place.

In order to make your output code reflect the proper NODE_ENV you have to use either the EnvironmentPlugin or the DefinePlugin. (The EnvironmentPlugin uses Define under the covers).

I personally prefer the explicitness of the DefinePlugin...

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
});
```

Or if you had passed in the `--env.production` thing, you could do like...

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': env.production ?
    JSON.stringify('production'),
    JSON.stringify('development'),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
});
```

p.s. You have to do the `JSON.stringify` thing so that in your code it'll do...

```js
if (process.env.NODE_ENV === 'production')

// Converts the above to

if ('production' === 'production')
```

### webpack 4

In webpack 4, what's nice is, there is a webpack configuration setting called `mode`. And when you set `mode: "production"`, it goes ahead and sets up the DefinePlugin for you. 

However, you still may run into a scenario where you need to make sure that the `babel-loader` knows your `NODE_ENV=production`. So, just keep a close eye on it.

# tldr;

Make sure when you're doing production webpack builds involving babel, particularly in webpack 3 where you don't have the `mode` option, make sure to set `NODE_ENV=production` when you run webpack.
