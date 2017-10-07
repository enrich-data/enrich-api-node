/*
 * enrich-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var Enrich = require("../").Enrich;
var assert = require("assert");


describe("enrich-api-node", function() {
  describe("constructor", function() {
    it("should succeed creating an instance with valid options", function() {
      assert.doesNotThrow(
        function() {
          new Enrich("dummy_user_id", "dummy_secret_key");
        },

        "Enrich should not throw on valid options"
      );
    });

    it("should fail creating an instance with missing secret_key", function() {
      assert.throws(
        function() {
          new Enrich("dummy_user_id");
        },

        "Enrich should throw on missing secret_key"
      );
    });

    it("should fail creating an instance with empty user_id", function() {
      assert.throws(
        function() {
          new Enrich("", "dummy_secret_key");
        },

        "Enrich should throw on missing user_id"
      );
    });
  });
});
