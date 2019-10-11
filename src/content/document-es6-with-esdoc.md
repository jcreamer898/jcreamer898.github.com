---
draft: false
layout: post
title: Document ES6 with ESDoc
image: img/cookie.jpg
author: Jonathan Creamer
date: 2015-09-29
tags: 
  - documentation
  - javascript
  - esdoc
---

I've been writing a lot of ES6(ES2015) at Lonely Planet the past few months. It comes with so many welcome changes to JavaScript, and with tools like Babel, you can use almost all of its features and even ES7(ES2016) features as well.

Tools for documenting ES6+ are now rolling out as well, and one great such tool is called [ESDoc](https://esdoc.org/). ESDoc is itself written in ES6+ code. JSDoc has [issues open](https://github.com/jsdoc3/jsdoc/milestones/3.4.0) for supporting it, but still has a little ways to go.

To use ESDoc, install it as a global...

```shell
npm install -g esdoc
```

or local module...
 
```shell
npm install esdoc --save-dev
```
 
One thing you can do if you save it as a local module is create a script in your package.json file...

```json
{
  "scripts": {
    "docs": "./node_modules/.bin/esdoc -c esdoc.json"
  }
}
```

Then you run ESDoc from the command line

```shell
esdoc -c esdoc.json

# Or if you installed it locally

./node_modules/.bin/esdoc -c esdoc.json

# then
open path/to/docs/index.html
```


### Configure
You can actually configure ESDoc with a [JSON file](https://esdoc.org/config.html). The most minimal configuration though is simply...

```json
{
  "source": "./path/to/src",
  "destination": "./path/to/esdoc"
}
```

### Features
ESDoc supports many of the same [tags](https://esdoc.org/tags.html) that JSDoc supports.

You can document classes like...

```js
/**
 * What a great class this is!
 * @example
 * let myClass = new MyAwesomeClass();
 */
class MyAwesomeClass {
  /**
   * Constructor for my awesome class
   * @param {number} foo The foo for my awesome class
   * @param {string} bar The bar for my awesome class
   */ 
  constructor(foo, bar) {...}
  /**
  * @emits {my.event} Emit an event
  */
  myEvent() {...}
}
```

### Search
Out of the box, it comes with a search feature that you can search for specific parts of your code base.

#### Tests
A really cool feature of ESDoc is it also ties unit tests to documentation.

Add some configuration to the `esdoc.json` file...

```json
{
  "source": "./src",
  "destination": "./out/esdoc",
  "test": {
    "type": "mocha",
    "source": "./test"
  }
}
```

Now when you run ESDoc you'll see the unit tests for a given class...

![](http://d.pr/i/1jVnH+)

#### Coverage
Every time you run ESDoc it will generate you a coverage report of how well documented your code is as well... 

![](http://d.pr/i/SGnB+)

You also get a badge you can use to display your coverage when you use the self hosting described below...

#### Self Hosting
You can actually go to https://doc.esdoc.org/-/generate.html and generate your documentation all online, and it will be self-hosted on ESDoc!

You're badge will look like...

![](http://d.pr/i/19ipr+)

And will be found at https://doc.esdoc.org/github.com/org/your-repo/badge.svg.

## Conclusion
Documentation is a great way to get people up to speed with your code base fast. So, it's important to use some kind of documentation service. ESDoc is still young, but has great potential to be a very useful tool!
