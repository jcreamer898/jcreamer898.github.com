---
draft: false
layout: post
title: Fetching data in a universal react router app with async actions
image: img/hattiebschicken.jpg
author: Jonathan Creamer
date: 2017-01-31
tags: 
  - react
  - react-router
  - async
  - ajax
  - isomorphic
  - redux
---


One of the most difficult things when working in a universal app is fetching data on the client side. With es2017 and the React lifecycle, it can be done easily.

I love `async` and `await` in [es2017](http://www.2ality.com/2016/02/async-functions.html). If you haven't started using them yet. Do it NAOW.

It even works in a lot of browsers natively now too! Including Microsoft Edge, Chrome, and node version 8... http://kangax.github.io/compat-table/es2016plus/#test-async_functions

![](/img/asyncarnold.jpeg)

Fetching data after a route transition in React Router can be confusing at first, but there's a fairly easy solution using the React lifecyle event `componentDidMount`. If you're working with a universal app, when you hit a component straight at it's url, say `/me/friends`, you'll already have the data via the initial state. But, when you come to that page via a client side react router render, how do you grab the data?

For example, on http://www.lonelyplanet.com/usa/nashville/restaurants/a/poi-eat/362228 you'll get a list of some of the best places to eat in Nashville. The list was rendered on the server side.

![](/img/list-1.png)

Now when I click [Hattie B's](https://www.lonelyplanet.com/usa/nashville/restaurants/hattie-bs/a/poi-eat/1513072/362228), we're going to use React Router to transition to a detail page for Hattie B's.

All of that rendering will be done on the client side.

![](/img/hattieb.png)

This is all done via the client side, and no full page render happens. Somehow though, we have to get the JSON data for Hattie B's so React has the data to render.

```js
// user.js
import React from "react";
import { connect } from "react-redux";
import Poi from "./poi";
import { fetchPoi } from "./actions";

export default class Restaurant extends Component {
  componentDidMount() {
    if (!this.props.poi) {
      this.props.fetchPoi();
    }
  }
  render() {
    return (
      <Poi poi={this.props.poi} />
    );
  }
}

const mapStateToProps = (state) => ({
  poi: state.poi,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPoi,
}, dispatch);

const connected = connect(mapStateToProps, mapDispatchToProps)(Restaurant);
export { connected };
```

The `componentDidMount` method only fires when the component renders on the client side. This means if you go directly to the Hattie B's page, the data will already have been fetch server side, so the `this.props.poi` will already be defined and passed through the page's `intitialState`.

However, when you come to the detail page via the list, the POI will be empty because it hasn't been fetch yet. Now we can talk about how to use `async` and `await` from `es2017` to create a nice clean actionCreator. Make sure you have `babel-polyfill`, and either `babel-env` or `babel-preset-es2017` available to be able to use the `async await` goodies.

```js
import { createAction } from "redux-actions";
export const FETCH_POI = "FETCH_POI";
export const FETCH_POI_DONE = "FETCH_POI_DONE";

const fetchPoiAction = createAction(FETCH_POI);
const fetchPoiDoneAction = createAction(FETCH_POI_DONE);

const fetchPoi = () => async (dispatch) => {
  dispatch(fetchPoiAction());
  
  const response = await fetch("/path/to/poi.json");
  const poi = await response.json();

  dispatch(fetchPoiDoneAction(poi));
};

export {
  fetchPoi,
};
```

So here we create an `async` arrow function. We can use `redux-thunk` to get `dispatch` passed in as an argument. Then use the new [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API to `await` for the `response`, `await` for the JSON to be downloaded, and then dispatch the final data so the reducer can add the POI to the state.

From their `connect` simply passes the POI into the component.

### Conclusion
Hopefully if you're working on a universal app with React Router, this will help you get your components loaded with data on the client side. Universal apps can definitely be tricky, but in the end, they're extremely powerful and fun to work with!
