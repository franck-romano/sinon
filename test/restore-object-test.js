"use strict";
/* eslint-disable no-empty-function */

var referee = require("@sinonjs/referee");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");
var restoreObject = require("../lib/sinon/restore-object.js");
var assert = referee.assert;
var refute = referee.refute;

describe("restore-object", function() {
    it("is defined", function() {
        assert.isFunction(restoreObject);
    });

    it("works on empty objects", function() {
        refute.exception(function() {
            restoreObject({});
        });
    });

    it("quietly ignores falsy input", function() {
        refute.exception(function() {
            restoreObject(false);
            restoreObject(null);
        });
    });

    it("works with no spies or stubs", function() {
        refute.exception(function() {
            restoreObject({
                catpants: function() {},
                meh: "okay"
            });
        });
    });

    it("works with mixed spies and stubs", function() {
        var object = {
            who: function() {},
            what: function() {},
            when: function() {},
            why: "I don't know"
        };

        sinonSpy(object, "who");
        sinonStub(object, "what");

        refute.exception(function() {
            object = restoreObject(object);
        });

        refute.isFunction(object.who.restore);
        refute.isFunction(object.what.restore);
        refute.isFunction(object.when.restore);
    });

    describe("spies", function() {
        it("restores entire object", function() {
            var object = sinonSpy({
                foo: function() {},
                bar: function() {}
            });

            object = restoreObject(object);

            refute.isFunction(object.foo.restore);
            refute.isFunction(object.bar.restore);
        });
    });

    describe("stubs", function() {
        it("restores entire object", function() {
            var object = sinonStub({
                foo: function() {},
                bar: function() {}
            });

            object = restoreObject(object);

            refute.isFunction(object.foo.restore);
            refute.isFunction(object.bar.restore);
        });
    });
});
