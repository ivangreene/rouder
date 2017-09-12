var pathToRegexp =  require('path-to-regexp');

class Rouder {
  constructor(config) {
    this.config = {
      // refreshNow: false,
      useHashes: true,
      usePaths: true,
      rootLocation: '/'
    };
    if (config) Object.assign(this.config, config);
    this.config.hashPrefix = (this.config.hashPrefix === undefined) ? this.config.rootLocation : this.config.hashPrefix;
    this.pushableState = !!(window.history && window.history.pushState);
    this.routes = {};
    this.stateObject = {};
  }

  start(checkNow) {
    // TODO: start listening
    if (checkNow) {} // TODO: refresh from current URL if checkNow is true
  }

  pause() {
    // TODO: pause listening
  }

  resume() {
    // TODO: safely resume listening
  }

  goTo(path) {
    if (this.pushableState && this.config.usePaths) {
      window.history.pushState(this.stateObject, '', path);
    } else if (this.config.useHashes) {
      window.location.hash = '#' + path;
    }
    this.handle(path);
  }

  use(path, cb) {
    var keys = [];
    var regex = pathToRegexp(path, keys);
    this.routes[path] = {regex: regex, keys: keys, cb: cb};
  }

  remove(path) {
    delete this.routes[path];
  }

  handle(path) {
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

module.exports = Rouder;
