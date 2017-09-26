var Window = require('../models/Window');
var Rouder = require('../../src/index.js');

['Modern', 'Legacy'].forEach(function(browser) {
  describe('In ' + browser.toLowerCase() + ' browsers, Rouder', function() {
    var rouder;
    var window;
    var config;
    var callback;

    beforeEach(function() {
      window = new Window[browser]();
      rouder = new Rouder({}, window);
    });

    it('should return an object, with `window` and `config` objects', function() {
      expect(rouder).toEqual(jasmine.any(Object));
      expect(rouder.window).toEqual(jasmine.any(Object));
      expect(rouder.config).toEqual(jasmine.any(Object));
    });

    it('should be listening when started, and be able to be paused or resumed', function() {
      rouder.start();
      expect(rouder.listening).toBe(true);
      rouder.pause();
      expect(rouder.listening).not.toBe(true);
      rouder.resume();
      expect(rouder.listening).toBe(true);
    });

    describe('routes', function() {
      it('can be defined with use()', function() {
        var someFunction = function() {};
        rouder.use('some-path', someFunction);
        expect(rouder.routes['some-path']).toBeDefined();
        expect(rouder.routes['some-path'].cb).toEqual(someFunction);
      });

      it('can be removed with remove()', function() {
        rouder.use('some-path');
        rouder.remove('some-path');
        expect(rouder.routes['some-path']).not.toBeDefined();
      });
    });

    describe('callbacks of routes', function() {
      beforeEach(function() {
        callback = jasmine.createSpy('callback');
        rouder.start();
        rouder.use('some-path', callback);
      });

      it('should be executed when `goTo()` or `handle()` are called', function() {
        rouder.goTo('some-path');
        rouder.handle('some-path');
        expect(callback).toHaveBeenCalledTimes(2);
      });

      it('should be called only once consecutively by `goTo()`, unless the force option is used', function() {
        rouder.goTo('some-path');
        rouder.goTo('some-path');
        rouder.goTo('some-path');
        rouder.goTo('some-path', true);
        rouder.goTo('some-path', true);
        rouder.goTo('some-path');
        expect(callback).toHaveBeenCalledTimes(3);
      });

      it('should be called with an object containing its parameters as the argument', function() {
        rouder.use('users/:name', callback);
        rouder.goTo('users/johann');
        expect(callback).toHaveBeenCalledWith({ name: 'johann' });

        rouder.use('tasks/:id(\\d+)/:action?/:foo', callback);
        rouder.goTo('tasks/51/bar');
        expect(callback).toHaveBeenCalledWith({ id: '51', action: undefined, foo: 'bar' });

        rouder.use('posts/:id(\\d+)?', callback);
        rouder.goTo('posts');
        rouder.goTo('posts/7');
        expect(callback).toHaveBeenCalledWith({ id: undefined });
        expect(callback).toHaveBeenCalledWith({ id: '7' });
      });
    });
  });
});
