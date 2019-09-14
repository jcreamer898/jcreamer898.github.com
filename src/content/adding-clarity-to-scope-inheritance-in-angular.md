---
draft: false
layout: post
title: Adding clarity to scope inheritance in angular
image: img/clouds.jpg
author: Jonathan Creamer
date: 2013-08-14
tags: 
  - angular
  - scope
  - inheritance
---

No matter how old JavaScript gets, the concept of prototypical inheritance still confuses developers. In fact, appendTo just gave a [training course](-functions-and-objects-8-12-2014/) on functions and objects that talked about it yesterday! Not to mention Jordan Kasper's great talk on [OO JavaScript](http://vimeo.com/62353516).

The fact is prototypical inheritance in JavaScript presents confusion to a lot of folks out there. In terms of Angular.js that may explain why the concept of `$scope` is [difficult to grok](http://jonathancreamer.com/working-with-all-the-different-kinds-of-scopes-in-angular/).

Let's take a step back to the root of the problem and try to understand prototypical inheritance a little better.

### POJCF's
Let's start with plain old javascript constructor functions (insert rimshot here).

This is a function...

```js
function Root() {}
```

Simple.

If you plan on using the `new` operator on this `Root` function, well then it's called a `constructor` function.

```js
var root = new Root();
```

Every JavaScript function has a `prototype`.

When you log the `Root.prototype`, you get...

![](http://d.pr/i/p0PN+)

Notice a few things here, first of all there's a `constructor` property on Root.prototype, and a mysterious looking `__proto__` member as well.

That __proto__ represents the prototype that this function is based off, and since this is just a plain JavaScript function with no inheritance set up yet, it refers to the `Object` prototype which is something just built in to JavaScript...

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype

This has things like `.toString`, `.toValue`, etc...

Technically the `__proto__` thing is deprecated and the way you get an object's prototype is by using the `Object.getPrototypeOf` method like this...

```js
Object.getPrototypeOf(Root.prototype); // Object {}
```

This will make even more sense shortly after the inheritance chain is set up. Stay tuned.

An object's prototype is basically it's DNA, but it's nothing more than an object with functions or properties on it!

So what happens when you add something to the `Root` prototype?

```js
function Root() {}

Root.prototype.add = function(x, y) {
	return x + y;
};
```

Well, now you've modified the DNA of the `Root` and added a function called `add` to it...

![](http://d.pr/i/A3Lk+)

That means when you create an instance of `Root`, you can call add it's add method.

```js
var root = new Root();

var sum = root.add(2, 2);

console.log(sum); // 4
```

You can also add primitives or object's to the `Root` prototype...

```js
Root.prototype.name = "Jonathan"; // String

Root.prototype.user = {}; // Object

Root.prototype.friends = []; // Array
```

### Creating a child
So, here's where things get interesting...

```js
function Root() {}

Root.prototype.add = function(x, y) {
	return x + y;
};

function Child() {}

Child.prototype = Object.create(Root.prototype); // Magic
Child.prototype.constructor = Child; // Gotta reset this

console.log(Child.prototype.add); // Looks up the chain
```

Now then, `Child` officially "inherits" it's prototype from `Root`. And there was much rejoicing.

First things first, the `Object.create` [method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create).  Don't  get to hung up on this, it's job is  *basically* to create a new object based off of whatever you pass in.

In this case what we're doing is setting the prototype of `Child` to a new object that looks identical to the `Root` prototype. The next logical step is to reset the `Child.prototype.constructor` and make sure it still points to the `Child` function. You have to do this because if you don't, then `Child.prototype.constructor` would point to the `function Root() {}`.

Because we set the `Child` prototype to the `Root` prototype, the `Child.prototype` now has the `add` method available...

Have a look here...

![](http://d.pr/i/zZJd+)

See how you can see the `Child` has it's `.prototype` property. Then, the `__proto__` helps point to the fact that the prototype of `Child` is based off of the prototype of `Root`, and the prototype of `Root` is based off of `Object`!

It's basically a tree...

```prettyprint
Child
|
 \
  \
   Root.prototype
   - add
   |
   |
    \
     \
      Object.prototype
      -toString
      -valueOf
      -etc., etc.
```

There's a couple of interesting things worth noting here...

When you create an instance of `Child` and call `add`...

```js
var child = new Child();
child.add(2, 2);
```

You haven't actually defined `add` on the `Child` prototype. BUT, you have definited it on the `Root` prototype which `Child` inherits from. So therefore, it will add stuff.

If I was to be a crazy person and give an `add` method to `Child` also, well that would rip a whole in the space time continuum right?!

![](http://stream1.gifsoup.com/view4/4648680/doc-brown-o.gif)

```js
Child.prototype.add = function() {
	return x - y; // troll
};
```

Thankfully it won't. But, what it will do is basically hide the parent's `add` method.

The same is true for primitive things on the `Root`. Earlier you saw this...

```js
Root.prototype.name = "";
```

So, same as the `add`, you can overwrite that `name` primitive string in the `Child` prototype...

```js
Child.prototype.name = "Mike"; // String
```

This again, masks the `name` property on `Root.prototype`.

### What's that have to do with $scope?!
EVERYTHING.

> Scope in angular is based off of prototypical inheritance.

Wherever you use `ng-app`, say on a `<body>` or `<html>` tag, angular is going to create you an instance of the `Scope` constructor function that will be referred to as the `$rootScope`.

All other scopes in angular come from this `$rootScope` by way of inheritance in EXACTLY the same way we've been talking about.

When you have something like this with an `ng-app` and an `ng-controller`...

```prettyprint lang-html
<body ng-app="Demo">
	<div ng-controller="FooCtrl"></foo>
</body>
</html>
```

Here's what happens.

First, there's a `$rootScope` created. Then essentially, the `FooCtrl` gets its own scope that prototypically inherits from the prototype of `$rootScope` which in terms of angular is `Scope.prototype`.

Here in the angular source code in `src/ng/rootScope.js` you can find the code for `Scope`...

```js
function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this['this'] = this.$root =  this;
      this.$$destroyed = false;
      this.$$asyncQueue = [];
      this.$$postDigestQueue = [];
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$isolateBindings = {};
    }
    
// ...

Scope.prototype = {
    constructor: Scope,
    $new: function() {}
    // etc, etc...
}      
```

The `$new` function is where new scopes are created...

```js
$new: function(isolate) {
  var ChildScope,
      child;

  if (isolate) {
    child = new Scope();
    child.$root = this.$root;
    child.$$asyncQueue = this.$$asyncQueue;
    child.$$postDigestQueue = this.$$postDigestQueue;
  } else {
    
    if (!this.$$childScopeClass) {
      this.$$childScopeClass = function() {
        // blah blah...
      };
      this.$$childScopeClass.prototype = this;
    }
    child = new this.$$childScopeClass();
  }
  
  // more stuff we don't care about right now...
 
  return child;
},
```

When an `ng-controller` directive is used, angular will call `$rootScope.$new` and create a new scope.

Following down the execution path, you'll see that a controller is not going to be an isolate scope so it'll jump into the `else` block. It then caches a reference to a function called `this.$$childScopeClass`.

It then sets the prototype of this function to the prototype of `Scope`...

```js
this.$$childScopeClass.prototype = this;
```

This is similar to calling `Object.create(Scope);`, but in this case `this` is referring to an instance of `Scope`.

### ng-controller

Here's some sample code that helps illustrate this...

```js
angular.module("Demo", [])
  .controller("ChildCtrl", function($rootScope, $scope) {
    $rootScope.rootyThing = "I am groot";
    console.log($scope.rootyThing);  
    console.log(Object.getPrototypeOf($scope)); // Scope
 });
```

And this HTML...

```prettyprint lang-html
<body ng-app="Demo">
  <div ng-controller="ChildCtrl">
  </div>
</body>
```

Let's break this thing down.

`ng-app` is set on the body and uses the `Demo` module.

Then `ChildCtrl` is set up on a div.

When the controller function fires it's asking for `$rootScope` and setting `rootyThing` up on it. Since `$scope` prototypically inherits from `$rootScope` you'll see how we're immediately able to access `rootyThing` on the local controller scope!

![](http://d.pr/i/Oe5G+)

The `Object.getPrototypeOf($scope);` call shows you the controller's `$scope` prototype is `Scope`.

Back to the idea of primitives or objects on prototypes, take a look at this...

```js
angular.module("Demo", [])
  .controller("ChildCtrl", function($scope) {
    $scope.name = "foo";
    $scope.user = {};
    $scope.user.name = "bar";
 })
 .controller("AnotherChildCtrl, function($scope) {
   $scope.name = "overwrites foo";
   $scope.user.name = "changes foo in ChildCtrl";
 });
```
```prettyprint lang-html
<body ng-app="Demo">
  <div ng-controller="ChildCtrl">
    <div ng-controller="AnotherChildCtrl">
	</div>
  </div>
</body>
```

So, first of all `$scope.name` is set on the `ChildCtrl`.

Then it's also set on the `AnotherChildCtrl`. Thinking back on the first examples of this, the `$scope.name` on `ChildCtrl` has in fact been overwritten in the same way as before.

If you need access to a variable from `ChildCtrl` inside of `AnotherChildCtrl`, then you have to use an object to do it! Ain't prototypical inheritance neato. 

In general, try not to just assign stuff directly to `$scope` as primitives. You're `$scope` is a place to PUT the "model", but is not actually the "model". You'll want to do more with objects and always see a "." in your views when referencing a `$scope` property.

Aka...

```prettyprint lang-html
{{user.name}}
```

vs.

```prettyprint lang-html
{{name}}
```

### Directive isolated scope
One last thing.

Take a look at the following video...

![](http://d.pr/i/K3Hx+)

This video is based off of this code... 

```js
angular.module("Demo", [])
  .controller("ChildCtrl", function($rootScope, $scope) {
    console.log("root", $rootScope);
    $rootScope.rootyThing = "I am groot";
    console.log("ctrl", $scope);
    $scope.childCtrlProp = "heyo";
 })
.directive("isoElement", function() {
  return {
    restrict: "E",
    scope: true,
    link: function(scope) {
      console.log("directive", scope);
      scope.foo = "bar";
      console.log(scope.childCtrlProp);
      console.log(scope.rootyThing);
    }
  };
}); 
```

When `scope: true` is used when creating a directive, you'll get inheritance.

If you use `scope: {}` and have properties on there, you've created an "isolated" scope. If you refer back to the source for `Scope.$new` you'll see where that happens.

```js
if (isolate) {
    child = new Scope();
    child.$root = this.$root;
    child.$$asyncQueue = this.$$asyncQueue;
    child.$$postDigestQueue = this.$$postDigestQueue;
}
```

# Conclusion
This stuff seems really complicated when you first get into it. The basic ideas though are all based on prototypical inheritance. If you'll fully grok that, then angular scope inheritance is nothing more than that. 
