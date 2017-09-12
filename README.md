# Rouder

Simple client-side SPA routing library.

### Features

- The biggest convenience is that backwards compatibility with legacy browsers not supporting non-refreshing location changes is baked in. Write routes once, and rouder will listen appropriately. You can use the outlined methods below to go to a URL that won't refresh the page.

- This library should work well to allow users to be able to share a link with expected results, and result in better crawlability of your site.

### Quick example

```js
var rouder = new Rouder();

var postsRoute = function(params) {
  console.log('Navigated to post #' + params.id + '!');
};

var usersRoute = function(params) {
  console.log('Now viewing ' + params.name + '\'s profile.');
};

rouder.use('posts/:id', postsRoute);
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

- `useHashes`: Boolean (default: `true`). Enables/disables watching for paths in hashtags (format `#/path`). Disabling will break backwards compatibility in legacy browsers, and `.linkTo()` will always return the same value it was passed.

- `usePaths`: Boolean (default: `true`). Enables/disables watching for regular path-based locations. By disabling this, you will need to use hashtag based paths only.

- `rootLocation`: String (default: `/`). Sets the root of your app, to base paths on.

- `hashPrefix`: String (defaults to `rootLocation`). Sets a prefix for any generated hashtag links, and enables listening for them appropriately. Good to minimize conflicts with any other hash links.

### Methods

- `rouder.start()`

  Begin listening for navigation. Should be called after the page is ready.

- `rouder.use(path, callback)`

  Accepts `path` as a String or RegEx (uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for parsing), and a callback function to be executed when that path is visited. The callback function will be passed one argument: an object containing key-value pairs of the parameters specified in the path, if any (otherwise an empty object).

- `rouder.remove(path[, path2[, pathN...]])` or `rouder.remove([path, path2, pathN...])`

  Stops listening for paths, using the same value they were defined with.

- `rouder.goTo('path')`

  Changes the browser URL to `path` without refreshing the page. This will obviously call any callback functions associated with `path`.

- `rouder.pause()`

  Pauses listening for navigation.

- `rouder.resume()`

  Resumes listening for navigation.

## Planned for later

- `rouder.watchLinks(['attribute'][, 'data-flagname'])`

  Causes rouder to begin watching HTML elements containing `data-flagname` (defaults to `data-rouder-watch`), and will change the URL in `attribute` (defaults to `href`) if needed for backwards compatibility in browsers not supporting non-refresh location changes without hashtags.

  For example, if you had HTML like

  ```html
  <a href="/posts/2" data-rouder-watch>
  <a href="http://example.com/users/bob" data-rouder-watch>```

  calling `rouder.watchLinks()` would cause rouder to determine browser compatibility for the user, and either leave these links as they are (a path-based URL), or prepend a hashtag to the path.

  In a legacy browser, the links would be changed to `#/posts/2` and `http://example.com/#/users/bob`.

  The links will be updated immediately upon `.watchLinks()` being called, and upon all page navigations (any hashchange or path change, whether it corresponds to a path defined with `rouder.use()` or not). You may also call `rouder.checkAllLinks()` at any time to manually refresh all watched links (such as when dynamic content that doesn't require a location change may contain links).

- `rouder.checkAllLinks()`

  Causes rouder to change watched HTML links if necessary. See `.watchLinks()` above.

- `rouder.linkTo('path')`

  Simply returns a link to `path` which will function in the current browser without refreshing the page (either a path-based URL, or a hashtag based URL). May be either a relative or absolute URL (will return the same type that was passed).
