---
draft: false
layout: post
title: Setup ESLint with ES6 in Sublime Text
image: img/sublime.jpg
author: Jonathan Creamer
date: 2015-07-31T07:03:47.149Z
tags: 
  - sublime
  - es6
  - eslint
---

[ESLint](http://eslint.org/) is a JavaScript linter/style checker that has quickly risen in popularity for a number of reasons. First of all, it's easily plugable. Second, it's sort of a hybrid between JSHint, and JSCS. Third, it's written by none other than [Nicholas Zakas](https://twitter.com/slicknet).

### Get Started with ESLint
It's super easy to use ESLint. You should already have Node.js installed, and then intsall ESLint...

```
npm install -g eslint
# Or
npm install eslint
```

You can install it either globally or locally. It's easier to just have it globally though.

### Configure
Create a `.eslintrc` in the root of your project. Then you can add `globals`, set up your environment with `env`, and add [rules](http://eslint.org/docs/rules/) as well.

```prettyprint lang-js
{
  "globals": {
    // Put things like jQuery, etc
    "jQuery": true,
    "$": true
  },
  "env": {
    // I write for browser
    "browser": true,
    // in CommonJS
    "node": true
  },
  // To give you an idea how to override rule options:
  "rules": {
    // Tons of rules you can use, for example...
    "quotes": [1, "double"]
  }
}
```

#### Rules
To use a rule, add it's name, then pass an array. The array is an array of options. The first is either...

* 0 - Disable the rule
* 1 - Warn about the rule
* 2 - Throw error about the rule

Then the next arguments can configure different parameters per rule. In this case, we're saying we want to throw a warning when single quotes are used rather than double quotes.

See the full list of rules [here](http://eslint.org/docs/rules/).

## ES6 (2015)
Since ESLint is so easily plugable and configurable, there are already ways of using it with the new version of Ecmascript.

### Parsers
There are different types of parsers available. One of them is the `babel-eslint`...

```prettyprint lang-js
"parser": "babel-eslint",
```
 
 This will allow you to utilize ES6 syntax.
 
## Sublime-Linter
There's a great plugin for Sublime Text called `Sublime-Linter`. Once it is installed, there are a bunch of other plugins for it as well, including one for ESLint! Install it with the `Command+Shift+P` shorcut...

![](http://d.pr/i/12f6i+)

You then have to do a bit of configuration to get it actually running against your code. Go to `Sublime Text -> Prefences -> Package Settings -> SublimeLinter -> Settings-User`...

![](http://d.pr/i/TtXN+)

In here, you have to tell Sublime-Linter where your `node` is installed using the `paths` option. You can do this by running `which node` on the command line. For example if you use `nvm` your config would look like this.

```prettyprint lang-json
"paths": {
  "linux": [],
  "osx": [
    "/Users/jonathanc/.nvm/versions/io.js/v2.0.0/bin"
  ],
  "windows": []
},
```

One other thing you might have to set depending on your syntax highlighter is an alias for your syntax highlighter. For ES6, Babel has a sublime plugin for syntax highlighting that you can install by searching for `Babel`.

Then in your config for the linter...

```prettyprint lang-json
"syntax_map": {
  "JavaScript (Babel)": "javascript",
}
```

Now when you have invalid JavaScript including ES6, you'll see warnings in the code...

![](http://d.pr/i/10oU3+)

That should help you get started linting, and writing better JavaScript in Sublime Text!
