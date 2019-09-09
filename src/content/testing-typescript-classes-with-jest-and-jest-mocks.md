---
draft: false
layout: post
title: Testing typescript classes with Jest and Jest Mocks
image: img/thanos-sdcc.jpg
author: Jonathan Creamer
date: 2017-04-12
tags: 
  - typescript
  - testing
  - jest
  - mocking
  - oo
  - object oriented
  - jest mock
  -
---
Typescript is a powerful way to build applications. It offers type checking to catch errors before they make it to the browser. On top of just utilizing typescript to catch bugs, it's still important to make sure Typescript code is tested.

Facebook released a testing framework called Jest a while ago as  that contains many built in features. You can kind of compare Jest to Mocha in saying that Jest is to Mocha as Angular is to React. Jest is an entire test framework with built in mocking, code coverage, watching, assertions, etc.

With a bit of config, you can easily begin testing Typescript with Jest, including setting up Mocks for testing classes.

Let's say we want to create an `EmailService`...

```ts
export class EmailService implements ICommunicator<IEmail> {
  sender: ICommunicator<IEmail>;
  
  constructor(sender: ICommunicator<IEmail>) {
    this.sender = sender;
  }

  send(item: IEmail) {
    this.sender.send(item);
  }
}
```

Here we're implementing an interface called `ICommunicator<Email>`...

```ts
export interface ICommunicator<T> {
  send: (item: T) => void,
}
```

This will allow us to implement any kind of communication interface, in the case we'll one for sending emails with `IEmail`...

```ts
export interface IEmail {
  to: string,
  from: string,
  subject: string,
  contents: string,
}

export class Email implements IEmail {
  to: string;
  from: string;
  subject: string;
  contents: string;
  
  constructor(to: string, from: string, subject: string, contents: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.contents = contents;
  }
}
```

So, in a unit test we want to test and make sure that when we create an `EmailService` that it will call the `ICommunicator`'s send method...

First of all, let's get Jest setup.

```
yarn add -D jest @types/jest
```

Then you need to add a few things to the `package.json`...

```
"jest": {
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "<rootDir>/preprocessor.js"
  },
  "testMatch": [
    "**/__tests__/*.(ts|tsx)"
  ]
}
```

Finally, create a `preprocesser.js` file...

```ts
const tsc = require('typescript');
const tsConfig = require('./tsconfig.json');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(
        src,
        tsConfig.compilerOptions,
        path,
        []
      );
    }
    return src;
  },
};
```

Now we'll be able to start writing some tests!

```ts
import { EmailService, ICommunicator, IEmail, Email } from "../";

describe("EmailService", () => {
  it("should send emails", () => {
    const Mock = jest.fn<ICommunicator<IEmail>>(() => ({
      send: jest.fn(),
    }));
    const mock = new Mock();
    const instance = new EmailService(mock);
    instance.send(new Email("to@foo.com", "from@foo.com", "oh hai", "Some foo email..."));

    expect(mock.send).toHaveBeenCalled();
  });
});
```

First of all, we'll create a Mock implementation of an Email communicator with...

```ts
const Mock = jest.fn<ICommunicator<IEmail>>(() => ({
  send: jest.fn(),
}));
```

Then create a couple of instances and call the `send` method...

```ts
const mock = new Mock();
const emailService = new EmailService(mock);
const email = new Email("to@foo.com", "from@foo.com", "oh hai", "Some foo email...");
emailService.send(email);
```

Lastly, we'll make sure that by calling `emailService.send` calls the mock implementation of the `ICommunicator<Email>`...

```ts
expect(mock.send).toHaveBeenCalled();
```

Hopefully that will help anyone looking to get started with Jest and Typescript!
