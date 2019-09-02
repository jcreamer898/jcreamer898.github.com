---
draft: false
layout: post
title: Debugging node and Jest tests with VS Code's Debugger
image: img/butterfly.jpg
author: Jonathan Creamer
date: 2018-06-08
tags: 
  - webpack
  - entry
  - package
---

[VS Code](https://code.visualstudio.com/) has become my favorite IDE for pretty much everything these days. There are so many great features it has to offer including the ability to debug node.js.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZvIzxXv1dJU" frameborder="0" allowfullscreen></iframe>

Here is the `launch.json` I used to get the debugger working for me.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run tests",
      "program": "${workspaceRoot}/node_modules/.bin/jest"
    },
    {
      "name": "Launch",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/bin/www",
      "stopOnEntry": false,
      "args": [],
      "cwd": "${workspaceRoot}",
      "preLaunchTask": null,
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/babel-node",
      "runtimeArgs": [
        "--nolazy"
      ],
      "env": {
        "NODE_ENV": "development",
        "ASSET_HOST": "http://localhost:8081",
        "NO_WEBPACK_MIDDLEWARE": "true"
      },
      "console": "internalConsole",
      "sourceMaps": true,
      "outFiles": []
    }
  ]
}
```
