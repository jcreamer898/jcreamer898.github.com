---
draft: false
layout: post
title: Using do expressions in Redux Reducers
image: img/beach-sunset.jpg
author: Jonathan Creamer
date: 2017-09-26
tags: 
  - redux
  - do-expression
  - es
---

There's an interesting proposal that's stage 1 currently (as of 9/26/2017) called `do expressions`. Thanks to the magic that is Babel, you can already go ahead and try this out with the do expression transform... https://babeljs.io/docs/plugins/transform-do-expressions/.

The basic idea is that you can have a block of code such as a few `if` statements, or a `try catch`, wrap them in a `do { }`, and whatever the final statement evaluates to, can be returned.

For example, have a look at a standard if block...

```js
function fizzBuzz() {
  let str;

  for (var i=1; i <= 20; i++) {
    if (i % 15 == 0) {
      str = "FizzBuzz";
    } else if (i % 3 == 0) {
      str = "Fizz";
    } else if (i % 5 == 0) {
      str = "Buzz";
    } else {
      str = i;
    }
  }

  return str;
}
```

Here you have to initialize str to something, then reassign it in each `if` block.

With `do expressions`, you can do the following...

```js
function fizzBuzz() {
  return do {
    for (var i=1; i <= 20; i++) {
      if (i % 15 == 0) {
        "FizzBuzz";
      } else if (i % 3 == 0) {
        "Fizz";
      } else if (i % 5 == 0) {
        "Buzz";
      } else {
        i;
      }
    }
  }
}
```

With `do expressions`, you don't need to initialize `str`, you can simply return the entire `do expression`. Each `if` gets evaluated, and the one that ends up being truthy simply returns its value out of the expression.

So, how about for a Redux reducer?

Well, most Redux reducer's are written in `switch` statements. Not a big deal, but I was curious if I could use a `do` and some `if` statements since I'm not the biggest fan of `switch` statements.

For example, this code is taken from a todomvc example...

```js
function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      return [...state, {
        id: state.reduce((maxId, todo) =>
          Math.max(todo.id, maxId), -1) + 1,
        completed: false,
        text: action.text
      }];
    }
    case DELETE_TODO: {
      return state.filter(todo =>
        todo.id !== action.id
      );
    }
    default:
      return state;
  }
}
```

Pretty straightforward, now check out the same reducer with `if`'s inside of a `do expression`...

```js
function todos(state = initialState, { type, text, id }) {
  return do {
    if (type === ADD_TODO) { 
      [...state, {
        id: state.reduce((maxId, todo) =>
          Math.max(todo.id, maxId), -1) + 1,
        completed: false,
        text
      }];
    }

    if (type === DELETE_TODO) {
      state.filter(todo => todo.id !== id);
    }

    state;
  }
}
```

It's nice that you don't have to see `return ` but once, and we've gotten rid of the `switch`. Not sure which one is better, but it's cool to have different options to build reducers in.

Feel free to discuss in the comments below!
