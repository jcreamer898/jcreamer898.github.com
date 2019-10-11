---
draft: false
layout: post
title: Scope creep, a deep dive into Angular's scope
image: ''
author: Jonathan Creamer
date: 2014-07-08
tags: 
  - angular
  - scope
---

Getting used to the concept of `scope` in Angular is among the more difficult concepts to fully grok when first being introduced to the magical land of Angular.

![](http://media0.giphy.com/media/11a9K7FLvTD9Kw/giphy.gif)

Like anything else though, "once you understand it, it's really not that bad"...

### $rootScope
This is the mother of all scopes. Quite literally. All other scopes in Angular descend from it. The `$rootScope` is created on the DOM element where you set up `ng-app`.

```html
<html ng-app> <!-- $rootScope created here -->
<body>
</body>
</html>
```

You can prove this to yourself by simply adding `ng-app` to the `html` tag of a page, and running this in the console...

```js
angular.element(document.documentElement).scope()
```

That will log out the `$rootScope` in the console.

If you go run any of the hello world examples for angular out there now, such as one like from the Angular home page...

```html
<!doctype html>
<html ng-app>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.13/angular.min.js"></script>
  </head>
  <body>
    <div>
      <label>Name:</label>
      <input type="text" ng-model="yourName" placeholder="Enter a name here">
      <hr>
      <h1>Hello {{yourName}}!</h1>
    </div>
  </body>
</html>
```

There is a **directive** here on the input called `ng-model`. The job of a directive is to link and element to a scope, and allow you to work with that DOM element by adding behavior, or transforming it.

The `ng-model` directive will bind `input`, `select`, and `textarea` elements to a scope.

In this case, this directive is linking an element to the `$rootScope` by adding a new `yourName` property to it.

Angular attaches to the *change* event of that element. Any time the change event fires, angular updates the value of `yourName` on the scope with the value of the element. This in turn tells anybody interested in the value of `yourName` that its value has changed. This is all done through angular's crazy dirty checking stuff.

In this case, there's no `yourName` property defined on `$rootScope` yet, so angular will just create it for you.

That concept is all known as **2 way data binding**; the concept of changing a model value which gets reflected in the UI and changing a UI that gets reflected in the model.

### $scope in controllers
The first step to understanding `$scope` in an Angular controller is to truly understand what a controller's job is in the first place.

> The job of a controller is to pass data from the model, to the view.

That's it. Plain and simple. The view (aka user) asks for something from the controller, and the controller turns to the model and says, "hey, I need this thing". Then the controller takes that thing, and hands it back to the view.

Controller are meant to be thin, and testable by keeping as much of your problem solving and state manipulation code inside of a "model". 

I generally think of the "model" in angular as a combination of [angular services](http://jonathancreamer.com/understanding-angular-js-services-the-easy-way/), and simple objects that you attach to scopes. So in essesnce your model can be whatever you want it to be which can be a little confusing at first.

The general idea though is that whatever your "model" is, you use `$scope` to tell your view about it. This is why some people will call `$scope` a "viewModel".

A controller's job with respect to Angular is to set up functions and properties that the view can use. The primary way you set these functions and properties up is by injecting `$scope` into the controller.

```js
angular.module("MyModule")
	.controller("FooCtrl", function($scope) {
    	$scope.user = {
        	name: "Foo"
        };

        $scope.doFoo = function() {
			// Do something!
		};
    });
```

When you use the `ng-controller` to bind an element to the view, a new `ChildScope` is created which prototypically inherts from the `$rootScope`.

You can then attach these values to the view with directives and expressions.

```html
<html ng-app="MyModule">
<body ng-controller="FooCtrl">
    {{user.name}}
    <button ng-click="doFoo()">Do It</button>
</body>
</html>
```

### Nested Controllers
This is where things get weird...

![](http://gifs.joelglovier.com/oh-shit/pirates-runs-away.gif)

Controllers can be nested so you have to be careful about a few things. Because of the fact that the scopes do inherit from other scopes, if you create a **primitive** value (string, number, boolean) on a parent scope, the child scope will have an be able to manipulate the value. 

What will happen though is if a child is changing **primitive** values on a parent, it will end up creating a copy of the value in the child, and break the inheritance chain.

This can be avoided...

> `ng-model` should always have a "." in the name

As a rule of thumb this can help avoid the problem of overwriting a parent's scope values.

```html
<input type="text" ng-model="user.name" />
```

When you add a `user` object onto a controller's scope, you can edit that user object's properties in the child and not break the inheritance chain from the parent.

Another thing you can do when nesting controllers is use the newer **controllerAs** syntax. 

```js
angular.module("MyModule")
	.controller("FirstCtrl", function() {
    	this.user = {
        	name: "Dr. Evil"
        };
    })
    .controller("SecondCtrl", function() {
    	this.lair = {
            name: "Underground"
        };
    });
```

```html
<div ng-controller="FirstController as first">
	<div ng-controller="SecondController as second">
    	{{first.user.name}}
        {{second.lair.name}}
    </div>
</div>
```

Using the **controllerAs** syntax is a small syntax change that can just add some clarity to where different values come from.

Notice how in the controller rather than assigning the values to `$scope`, they are actually assigned to `this`.

Don't let this fool you too much. When you use this syntax, that simply means it will take the values you put on `this`, and under the covers, assign them to `$scope`.

Using `controllerAs` is effectively the same thing as this...

```js
angular.module("MyModule")
	.controller("FirstCtrl", function($scope) {
        $scope.first = this;
        
        $scope.first.user = {
        	name: "Dr. Evil"
        };
    })
    .controller("SecondCtrl", function($scope) {
        $scope.second = this;
        
        $scope.second.lair = {
            name: "Underground"
        };
    });
```

It's just a little cleaner to not have to use `$scope` when you don't need to do anything but assign values and functions.

### scope in directives
Another sticky place when working with scopes in Angular is when writing custom directives. Part of the confusion comes from the fact that when you create a directive, one of the properties you pass on the directive definition is `scope`...

```js
angular.module("MyModule")
  .directive("MyDirective", function() {
    return {
      scope: "false|true|{}"
    }
  });
```

There are a few options when setting up scope for a directive. First of all, the default value for this option is `scope: false`.

```js
angular.module("MyModule")
  .directive("MyDirective", function() {
    return {
      scope: false,
      link: function(scope, el) {
        scope.myNewProp = "OOPS, I'm on the parent!";
      }
    }
  });
```


This default can lead to some dangerous issues especially when trying to create re-usable directives...

![](http://i.imgur.com/vpYexIk.jpg)

When you have `scope: false`, the a new scope will NOT be created for this directive. That means it will use the parent scope by default. So, if you think you're creating a property on a scope local to your directive, you are in fact actually creating a property on the parent scope. Not a very re-usable solution.

Another option you have is to pass `scope: true`.

Passing this option will tell angular to create you a new child scope for this directive. This child scope will be similar to how the scope in the `ng-controller` works. It will prototypically inherit from it's parent in the exact same way.

This means you'll have access to the parent scope, but also be able to add new properties to a scope local to the directive...

```js
angular.module("MyModule")
  .directive("MyDirective", function() {
    return {
      scope: true,
      link: function(scope, el) {
        scope.someParentObject.foo = "See I can still change things because of inheritance";
        
        scope.someLocalObject = {
          foo: "Yay, I'm local only to this direcive!"
        }
      }
    }
  });
```

In this example you can see that because of prototypical inheritance, this directive's scope will have access to a parent property. The difference now though is that when a NEW property is added to the scope, it will be created locally within the directive's scope and not directly on the parent scope.

The **Isolate Scope** is the most complicated form of scope for directives.

```js
angular.module("MyModule")
  .directive("MyDirective", function() {
    return {
      scope: {
        property: "=",
        expression: "@"
        action: "&"
      },
      link: function(scope, el) {
        scope.someParentObject.foo = "See I can still change things because of inheritance";
        
        scope.someLocalObject = {
          foo: "Yay, I'm local only to this direcive!"
        }
      }
    }
  });
```

When an object literal is passed as the parameter value for `scope` on a directive, a new `isolate` scope is created for the directive. It still inherits from the parent scope, however only the named properties from the `scope` parameter will be passed into this new isolated scope.

You can almost think of the `scope` option as a filter with three different ways of filtering. You can see each of the three in the previous example: "@", "=", and "&".

Here's examples on how to use each of the three methods.

### =

```js
angular.module("MyApp", [])
  .controller("UserCtrl", function($scope) {
    $scope.loggedInUser = {
      name: "Austin Powers"
    }
  })
  .directive("myUserDirective", function() {
    return {
      restrict: "E",
      template: "<input ng-model='user.name' /></div>",
      scope: {
        user: "="
      },
      link: function(scope) {
        console.log(scope.user) // { name: "Austin Powers" }
      }
    };
  });
```

You would then use this directive like...

```html
<my-user-directive user="loggedInUser"></my-user-directive>
```

By adding `user: "="` to the `scope` property of your directive, you've basically setup a way to pass an object from the parent scope down to the directive scope by using `user="loggedInUser"` as an attribute on the directive. 

It's also worth noting that if you wanted to, with any of the three scope properties you can pass an optional alias name along with '=, @, or &', there will be an example of this later.

When using the `=` sign as an option you have basically set up a two way binding between the directive and the parent scope. If you then change `user` in the directive, the change will be reflected in the parent's `loggedInUser` property.

The `=` option will always be a single string value (no {{}}'s are needed here) representing some property on the parent scope of the directive. So, here in the previous case, `loggedInUser` is a property on the `UserCtrl`'s scope.

When you type in the input box generated by the directive, you'll see `ng-model="user.name"`. Changing the value of this text box will actually end up changing the `loggedInUser.name` from `UserCtrl`!

### @

The `@` option of scope is a way to pass in a string value, or a value containing `{{}}`'s that will get interpolated.

This is effectively a one way binding. You cannot change the value on the directive scope and have it be reflected in the parent scope, unlike with the `=` option. If you want to reference properties from the parent scope, you must use the curly braces around them. Whatever you pass in as the value of a property that uses the `@` option will be interpolated.

Here's an example...

```js
angular.module("MyApp", [])
  .controller("UserCtrl", function($scope) {
    $scope.loggedInUser = {
      firstName: "Austin",
      middleName: "Danger",
      lastName: "Powers"
    };
  })
  .directive("myUserDirective", function() {
    return {
      restrict: "E",
      template: "{{fullName}}",
      scope: {
        fullName: "@name"
      }
    };
  });
```

And this is how you would use that directive...

```html
<my-user-directive 
        name="{{loggedInUser.firstName}} {{loggedInUser.middleName}} {{loggedInUser.lastName}}">
        </my-user-directive>
```

Notice that in the `name="..."` the `loggedInUser.firstName`, is a value on the parent of the directive in the `UserCtrl`.

On the directive scope, because of `fullName: "@name"`, you'll see that you can pass values via the `name` attribute and the `fullName` will be added to the scope. String interpolation will kick in, and `fullName` is going to equal "Austin Danger Powers". That's also what the template `template: "{{fullName}}",` will render.

### &

The last option for `scope` in a directive is `&`. This allows you to fully invoke an expression within the context of the parent scope. You basically get a wrapper function that wraps whatever you pass in so you can invoke it in the directive.

The following example is a bit trivial, but in order to fully understand this concept, it's a good place to start.

```js
angular.module("MyApp", [])
  .controller("MathCtrl", function($scope) {
    $scope.add = function(x, y) {
      return x + y;
    };
  })
  .directive("myAddThings", function() {
    return {
      restrict: "E",
      template: "{{result}}",
      scope: {
        localFn: "&fn"
      },
      link: function(scope) {
        scope.result = scope.localFn({
          x: 1,
          y: 2
        });
      }
    };
  });
```

So, you can see here the `localFn: "&fn"`. This means that in your `scope`, you'll have a `localFn` available. You can then use that function in the scope of the directive and pass in values via a hash map that will execute in the parent's context.

The way this works is by passing in an object that has keys which match the arguments you pass in via the HTML when you invoke the directive...

```js
scope.result = scope.localFn({
  x: 1,
  y: 2
});
```

See how here in the HTML you have...

```html
<my-add-things fn="add(x, y)"></my-add-things>  
```

Here's one more practical example of how you can use this option in a directive scope...

```js
angular.module("MyApp", [])
  .controller("MathCtrl", function($scope) {
    $scope.add = function(x, y) {
      return parseInt(x, 10) + parseInt(y, 10);
    };
  })
  .directive("myAddThings", function() {
    return {
      restrict: "E",
      template: 
        "<input ng-model='vals.x' /><input ng-model='vals.y' />" +
        "<button ng-click='sum = localFn({ x: vals.x, y: vals.y })'>Add</button>" +
        "<div>{{sum}}</div>",
      scope: {
        localFn: "&fn"
      }
    };
  })
```

In this example, there's 2 inputs in the template. One bound to `vals.x`, and one bound to `vals.y`. Since neither of these are previously defined in any scopes, they'll be added to the directives isolated scope.

Then the button has an `ng-click='sum = localFn({ x: vals.x, y: vals.y })'` directive. Every time that this button is clicked, it will evaluate the expression. Since the `$scope.add` function is defined in the parent directive, and passed in through the `localFn: "&fn"`, you can then pass in the map of values to execute the add function.

Since `$scope.add` simply retuns a value, you can then assign `sum` which will then be another value in the directive scope and can also be used in the template with `{{sum}}`.

### Conclusion
Hopefully this helps groking all the scopes in Angular! There's a lot of things to fully wrap your head around with Angular and this is just one of the pieces. Like learning any framework though, it just takes a bit of time and practice to get things really going and fully comprehended.

