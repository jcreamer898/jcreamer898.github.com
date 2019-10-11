---
draft: false
layout: post
title: Creating a custom TypeScript API client for your team
image: img/butterfly.jpg
author: Jonathan Creamer
date: 2019-10-11
tags: 
  - typescript
  - fetch
  - api
---

One of the things I constantly find myself re-inventing is a client for some API. I've used many different libraries like, [request](https://github.com/request/request), [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch), [$.ajax](https://api.jquery.com/jquery.ajax/), etc.

Once a team and their problem domain, and/or API becomes big enough, even in the most simplest of cases, it becomes very helpful to have one consistent way to fetch data.

With TypeScript, you can make a very simple, and very re-usable API client pretty easily, and it all starts with interfaces.

## IDD
We're programmers and we love "X"-DD, where `X = Test | Behavior | Unit | .....`.

I'd like to propose another one..  

> Interface Driven Development

The basic premise here is, define your API's and contracts by way of `interfaces`.

Let's create a super simple Github API client.

### Start with data modeling
There are lots and lots of ways to model data, some easy, some more complex. In a lot of cases though, it's simple enough to just make an interface using TypeScript, and rely on it where you'd expect.

```ts
export interface GithubUser {
  "login": string;
  "id": 1;
  "node_id": string;
  "avatar_url": string;
  "gravatar_id": string;
  "url": string;
  "html_url": string;
  "followers_url": string;
  "following_url": string;
  "gists_url": string;
  "starred_url": string;
  "subscriptions_url": string;
  "organizations_url": string;
  "repos_url": string;
  "events_url": string;
  "received_events_url": string;
  "type": "User",;
  "site_admin": false;
  "name": string;
  "company": string;
  "blog": string;
  "location": string;
  "email": string;
  "hireable": boolean;
  "bio": string;
  "public_repos": number;
  "public_gists": number;
  "followers": number;
  "following": number;
  "created_at": Date;
  "updated_at": Date;
}
```

Where did I get that information you ask? Straight from their [API docs]()https://developer.github.com/v3/users/! 

There's ways you can generate Type Definitions based on Schemas like [swagger](https://github.com/mstssk/sw2dts), [json schema](https://www.npmjs.com/package/json-schema-to-typescript), etc. These things can help prevent the brittle nature of APIs changing. For now though, we can just make our own.

Ok, now let's create a super simple wrapper around fetching a Github User.

```ts
export interface FetchOptions {
  // ...
}

const fetchResource = async <ReturnType>(url: string, options?: FetchOptions) => {
  const resp = await fetch(url, options);
  
  if (resp.status !== 200) {
    const error = await resp.json();

    return {
      error: error.message,
    };
  }
  
  const json = await resp.json() as ReturnType;

  return json;
}
```

Notice the use of the `<ReturnType>` above, this is what in programming terms is called a [generic](https://www.typescriptlang.org/docs/handbook/generics.html).

It basically allows you to pass types around to different functions, almost like a function parameter. You can explicitly declare them as in our example above, or they can implicitly be set by the types you assign in your function parameters.

Now we've handled fetching, and error handling for our base client API, so let's start fetching the `GithubUser.`

![](https://d.pr/i/L3GJlr+)

Once many of these domain models have interfaces around them, you all the sudden have built in API documentation too!

Notice how above in that screenshot, you see all the properties available on the fetched user.

You can also even add JSDoc style comments to the properties on the interface as well, and they will show up in your IDE like VS Code.

```ts
export interface GithubUser {
  /**
   * The username essentially
   */
  "login": string;
```

![](https://d.pr/i/C7ILVX+)
