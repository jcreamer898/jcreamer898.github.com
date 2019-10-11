---
draft: false
layout: post
title: Using jQuery's $.ajax in an Angular app
image: img/storm.jpg
author: Jonathan Creamer
date: 2014-09-03
tags: 
  - angular
  - jquery
  - ajax
---

We've all been using jQuery for a long time. It's for this reason that Angular.js works seemlessly with jQuery if it sees it on the page, but also has it's on jQLite available for those who decide to opt out of jQuery.

One of the APIs in jQuery that I find myself using the most is `$.ajax`.

Now I know that Angular has it's own `$http` service that works great, but I was thinking the other day how I sometimes wish I could just use jQuery's `$.ajax` instead.

There's a couple of reasons for this, one is that I already know the API. I have to google `$http` every now and then to make sure I'm using it right.

Another reason is I really like to use [jQuery Mockjax](https://github.com/appendto/jquery-mockjax). It's a very simple way to mock HTTP requests without having to tap into the `$httpBackend` of Angular.

I decided to throw together a small Angular service that utilizes jQuery's `$.ajax` for use in services and controllers...

```js
(function($) {
  function Ajax($rootScope, $dfd) {
    var ajax = jQuery.ajax;
    
    return function(options) {
      var promise = ajax(options),
          dfd = $dfd();
          
      promise.done(function(data) {
        $rootScope.$apply(function() {
          dfd.resolve(data);
        });
      }).fail(function() {
        var failArgs = arguments;
        
        $rootScope.$apply(function() {
          dfd.reject.apply(dfd, failArgs);
        });
      });
      
      return dfd.promise();
    };
  }
  
  Ajax.$inject = ['$rootScope', '$dfd'];
  
  angular.module("Ajax")
    .provider("$ajax", function() {
      this.defaults = {};
      
      this.setOptions = function() {
        $.ajaxSetup(this.defaults = options);
      };
      
      this.getOptions = function() {
        return this.defaults;
      };
      
      this.$get = Ajax;
    });
}(jQuery));

(function($) {
  function Dfd() {
    return function() {
      return jQuery.Deferred();
    };
  }

  angular.module("Ajax")
    .factory("$dfd", Dfd);
}(jQuery));
```

So, there's a few pieces here. First of all is the `Ajax` function. This function's job is to return the API for the new `$ajax` services we're creating.

The first thing it does is grab a reference to `jQuery.ajax` and then returns a function.

We're then immediately invoking `ajax` in that function and getting it's promise back. Next we're using the `$dfd` service which is defined down farther in the code, but essentially just creates a new jQuery promise.

We're then callin the `.done` method on the Ajax promise and passing a function. `$rootScope` is injected into the service so when the Ajax promise is resolved we're able to call `$rootScope.$apply()` to ensure that the data returned is used within the angular exectution context.

We then resolve the promise we created with `$dfd()`.

There is also a `.fail` which also calls `$rootScope.$apply` in case something goes wrong when making the request.

At the end of the service we simply return the `dfd.promise()`.

This service is actually defined as a `provider` and the reason for this is whatever returns from `$get` in the `provider` becomes the API for the service, but this also gives us a place to configure the service.

There are `setOptions` and `getOptions` functions that allow you to conigure the `$.ajax` defaults with jQuery's  `$.ajaxSetup` method.

```js
angular.module('Foo',).config(function($ajaxProvider) {
	$ajaxProvider.setConfig({ /* .. */ });
});
```

The way you actually utilize this new service in a controller would look like...

```js
angular.module("Ajax", [])
  .controller("WeatherCtrl", function($ajax, $scope) {
    $ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk",
      dataType: "JSONP"
    }).done(function(weather) {
      $scope.weather = weather;
    });
  });
```

Here is the example running in a Plnkr...

<iframe src="http://embed.plnkr.co/LrEzPj/preview" frameborder="0" style="width: 100%; height: 400px;"></iframe>

It's very easy to utilize the well known `$.ajax` API from jQuery with this service.
