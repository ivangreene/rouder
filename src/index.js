var pathToRegexp = require('path-to-regexp');

class Rouder {
  constructor(config) {
    this.config = {
      useHashes: true,
      usePaths: true,
      rootLocation: '/'
    };
    if (config) Object.assign(this.config, config);
    if (this.config.hashPrefix === undefined) this.config.hashPrefix = this.config.rootLocation;
    this.pushableState = !!(window.history && window.history.pushState);
    this.routes = {};
    this.stateObject = {};
    this.listening = false;
  }

  start(checkNow) {
    this.listening = true;
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

  goTo(path) {
    if (this.listening) {
      if (this.pushableState && this.config.usePaths) {
        window.history.pushState(this.stateObject, '', path);
      } else if (this.config.useHashes) {
        window.location.hash = '#' + path;
      }
      this.handle(path);
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
    }
  }
}

module.exports = Rouder;
