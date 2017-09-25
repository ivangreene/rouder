var pathToRegexp = require('path-to-regexp');

class Rouder {
  constructor(config, $window) {
    this.window = $window || window;
    this.config = {
      useHashes: true,
      usePaths: true,
      watchHashes: true,
      preserveonhashchange: true,
      rootLocation: '/',
      hashPrefix: '/'
    };
    if (config) Object.assign(this.config, config);
    this.pushableState = !!(this.window.history && this.window.history.pushState);
    this.routes = {};
    this.stateObject = {};
    this.lastPath = '';
    this.hashRegex = new RegExp(`^#${this.config.hashPrefix}(.+)$`);
    this.listening = false;
  }

  start(checkNow) {
    this.listening = true;
    if (this.config.watchHashes) {
      this.oldonhashchange = this.config.preserveonhashchange && typeof this.window.onhashchange === 'function' ? this.window.onhashchange : (() => {});
      this.window.onhashchange = () => {
        this.oldonhashchange();
        var match;
        if (this.window.location && this.window.location.hash) match = this.window.location.hash.match(this.hashRegex);
        if (match && match[1]) this.handle(match[1]);
      }
    }
    if (checkNow) {
      // TODO: refresh from current URL if checkNow is true
    }
  }

  pause() {
    this.listening = false;
  }

  resume() {
    this.listening = true;
  }

  goTo(path, force) {
    if (this.listening) {
      if (this.pushableState && this.config.usePaths) {
        if (this.lastPath !== path || force) {
          this.window.history.pushState(this.stateObject, '', `${this.config.rootLocation}${path}`);
          this.handle(path);
        }
      } else if (this.config.useHashes) {
        if (!this.config.watchHashes || force && this.window.location.hash === `#${this.config.hashPrefix}${path}`)
          this.handle(path);
        this.window.location.hash = `#${this.config.hashPrefix}${path}`;
      }
    }
  }

  use(path, cb) {
    var keys = [];
    var regex = pathToRegexp(path, keys);
    this.routes[path] = {regex, keys, cb};
  }

  remove() {
    var args = (typeof arguments[0] === 'array' || typeof arguments[0] === 'object') ? arguments[0] : arguments;
    for (var a = 0; a < args.length; a++) {
      delete this.routes[args[a]];
    }
  }

  handle(path) {
    if (this.listening) {
      for (var r in this.routes) {
        var route = this.routes[r];
        var match = path.match(route.regex);
        if (match) {
          match.shift();
          var keys = {};
          for (var k = 0; k < match.length; k++) {
            keys[route.keys[k].name] = match[k];
          }
          route.cb(keys);
          break;
        }
      }
      this.lastPath = path;
    }
  }
}

module.exports = Rouder;
