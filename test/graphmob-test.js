/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var Graphmob = require("../").Graphmob;
var assert = require("assert");


describe("graphmob-api-node", function() {
  describe("constructor", function() {
    it("should succeed creating an instance with valid options", function() {
      assert.doesNotThrow(
        function() {
          new Graphmob();
        },

        "Graphmob should not throw on valid options"
      );
    });

    it("should fail creating an instance with missing user_id", function() {
      assert.throws(
        function() {
          new Graphmob();
        },

        "Graphmob should throw on missing user_id"
      );
    });

    it("should fail creating an instance with missing secret_key", function() {
      assert.throws(
        function() {
          new Graphmob();
        },

        "Graphmob should throw on missing secret_key"
      );
    });
  });
});
