class Window {
  constructor() {
    this.location = {
      get hash() {
        return this._hash;
      }
    };
    Object.defineProperty(this.location, 'hash', {
      set: function(val) {
        if (this.location._hash !== val) {
          this.location._hash = val;
          this.onhashchange();
        }
      }.bind(this)
    });
  }
}

class Modern extends Window {
  constructor() {
    super();
    this._history = [];
    this.history = {
      pushState: function(stateObject, page, path) {
        this._history.push(path);
      }.bind(this)
    };
  }
};

module.exports = Window;

module.exports.Modern = Modern;

module.exports.Legacy = class Legacy extends Window {};
