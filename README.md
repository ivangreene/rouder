# Rouder

Simple client-side routing library.

### Features

- Define Rouder instances to use either path-based or hash-based routes, or select automatically depending on browser compatibility.

- Backwards compatibility with legacy browsers not supporting non-refreshing location changes is baked in. Write routes once, and rouder will listen appropriately. You can use the outlined methods below to go to a URL that won't refresh the page.

- This library should work well to allow users to be able to share a link with expected results, and result in better crawlability of your site.

- Intended specifically for browser based environments as it relies on browser-exclusive APIs.

### Including

#### Rouder is available for direct use from the unpkg CDN at https://unpkg.com/rouder as either minified or not.

The builds in `dist/` will define `Rouder` as a global.

```html
<!-- Latest minified build (links to dist/rouder.min.js) -->
<script src="https://unpkg.com/rouder"></script>

<!-- Latest unminified build -->
<script src="https://unpkg.com/rouder/dist/rouder.js"></script>
```

#### Rouder can also be imported in a JavaScript file that will be prepared for the browser with a build tool such as webpack or browserify.

```js
var Rouder = require('rouder');
```

### Quick example

```js
var rouder = new Rouder(); // An optional config object could be passed here

var postsRoute = function(params) {
  console.log('Navigated to post #' + params.id + '!');
};

var usersRoute = function(params) {
  console.log('Now viewing ' + params.name + '\'s profile.');
};

rouder.use('posts/:id', postsRoute); // Define routes with .use()
rouder.use('users/:name', usersRoute);
rouder.use('home', function() {
  console.log('Going home...');
});

rouder.start(); // Start listening for our defined routes

rouder.goTo('posts/12');

rouder.remove('home', 'posts/:id'); // Routes can later be removed by using the same path they were defined with
```

### Config options

  You may pass these options in an object to `new Rouder()`.

- `usePaths`: Boolean (default: `true`). Enables/disables watching for regular path-based locations. By disabling this, you will need to use hashtag based paths only.

- `useHashes`: Boolean (default: `true`). Enables/disables linking to hashes with `.goTo()`. (format `#/path`). Disabling will break backwards compatibility in legacy browsers.

- `rootLocation`: String (default: `"/"`). Sets the root of your app, to base paths on.

- `hashPrefix`: String (defaults: `"/"`). Sets a prefix for any generated hashtag links, and enables listening for them appropriately. Good to minimize conflicts with any other hash links.

- `preserveonhashchange`: Boolean (default: `true`). Enables/disables the preservation of any function that was already assigned to `window.onhashchange`, and will run that function before executing the routing logic.

- `watchHashes`: Boolean (default: `true`). Enables/disables watching for hash changes using `window.onhashchange`. Hash based paths can still be used with this option disabled, but they will need to be run using `.goTo()` instead of simply linked to.

- An alternative `window` object may be passed as the second argument to `new Rouder()`. This is used in the pre-build tests and may not have a real use application.

### Methods

- `rouder.start()`

  Begin listening for navigation. Should be called after the page is ready.

- `rouder.use(path, callback)`

  Accepts `path` as a String or RegEx (uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for parsing), and a callback function to be executed when that path is visited. The callback function will be passed one argument: an object containing key-value pairs of the parameters specified in the path, if any (otherwise an empty object).

- `rouder.remove(path[, path2[, pathN...]])` or `rouder.remove([path, path2, pathN...])`

  Stops listening for paths, using the same value they were defined with.

- `rouder.goTo(path[, force])`

  Navigates to `path`, relative to the configuration, without refreshing the page. This will call any callback function associated with `path`, unless this is navigating to the same path as the last path executed. Pass in `true` as the second argument to force any callback function to be run regardless.

- `rouder.pause()`

  Pauses listening for navigation.

- `rouder.resume()`

  Resumes listening for navigation.
