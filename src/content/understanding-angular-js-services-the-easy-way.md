---
draft: false
layout: post
title: Understanding Angular.js services the easy way
image: img/grafitti.jpg
author: Jonathan Creamer
date: 2015-05-14
tags: 
  - angular
  - services
  - factory
---

One of the difficulties when first learning angular is understanding services and what they really are.

One of the problem with services is there are several different ways to create one. This leads to many people saying which one should I choose? There's been over 131k views on this Stack Overflow question...

http://stackoverflow.com/questions/15666048/angular-js-service-vs-provider-vs-factory

That's a lot.

I've been doing some source diving in Angular lately and came across the following code...

![](http://d.pr/i/R0zs+)

There it is in less than 10 lines of code exactly what each three are; they are nothing but calls to the underlying provider method! Each one just calls the provider slightly differently. In any of the 3 cases though, the services are singletons, as well as lazy loaded.

Let's break them down...

### Factory
Here's the factory formatted a bit better. All it is is a call to the underlying `provider` method, and it passes along a function as the `$get` method.


```js
function factory(name, factoryFn) {
    return provider(name, {
      $get: factoryFn
    });
}
```
The `$get` will later be called by the `$provider` whenever someone tries to use the service. Here's how this looks when actually creating a factory.

```js
angular.factory('MyService', function MyService() {
    return {
        doSomething: function() { /* ... */}
    };
});
```

So essentially the `function MyService()` is passed down and to `$get` and a new `provider` is created...

The way the factory works is, whatever you return from the `MyService` function is what you'll get when you inject this service anywhere in your application...

```js
app.controller('HomeController', function(MyService) {
	MyService.doSomething();
});
```


### Service
Another way to create an Angular service is with the actual `service` method...

```js
function service(name, constructor) {
    return factory(name, ['$injector',
        function($injector) {
            return $injector.instantiate(constructor);
        }
    ]);
}
```

The `service` method actually just makes a call to the `factory` method, thereby calling the `provider` method again. In the case of a `service` method, the `$get` will be set to the `factory` function that is returned from the `service` method aka `return factory(name, ['$injector',`. 

The returned function turns around and asks for the `$injector` as a dependency so that it can create an instance of whatever you pass in as the `constructor` to the `service` method...

```js
angular.factory('MyService', function MyService() {
    this.doSomething = function() {
        /* DO IT, DO IT NAOW */
    }
});
```

In other words, the function passed in as the second argument just get's called with the `new` operator and the instance of that function is returned to whatever injects the service laster. 

### Value
The last type of service you can create with angular is a `value` service...

```js
function value(name, val) {
  return factory(name, valueFn(val));
}
```

The `value` service in turn calls the `factory` function once again. A `value` service is really meant to do nothing more than return whatever is passed in as `val`. That's what the `valueFn(val)` does above...

```js
function valueFn(value) {
	return function() {
    	return value;
    };
}
```

You can use the `value` service method as a way to store some state, some configuration options or whatever you may need it for...

```js
angular.value('Values', ['foo', 'bar', 'bam']);
```

Then you can inject it and simply use whatever value is returned...

```js
app.controller('HomeController', function(Values) {
	Values.forEach(function(val) {
    	console.log(val);
    });
});
```

## Conclusion
Hopefully that helps at leat eliminate some of the confusion what Angular.js services are. How you use them is still totally up to you as a developer, but it's good to at least have an understanding of what you're working with. The three different methods have different use cases, but to reiterate are all going to be singleton methods that you can inject anywere else that you can inject things in an angular app.
