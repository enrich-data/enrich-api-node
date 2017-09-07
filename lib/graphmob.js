/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var restler   = require("restler");

var __Promise = (
  (typeof Promise !== "undefined") ?
    Promise : require("es6-promise-polyfill").Promise
);


var DEFAULT_REST_HOST = "https://api.graphmob.com";
var DEFAULT_REST_BASE = "/v1";

var RESOURCES = [
  "search",
  "verify",
  "enrich"
];


/**
 * Graphmob
 * @class
 * @classdesc  Instanciates a new Graphmob connector.
 * @param      {object} options
 */
var Graphmob = function(user_id, secret_key, options) {
  options = (options || {});

  // Sanitize options
  if (typeof user_id !== "string" || !user_id) {
    throw new Error("Invalid or missing user_id");
  }
  if (typeof secret_key !== "string" || !secret_key) {
    throw new Error("Invalid or missing secret_key");
  }

  // Prepare storage
  this._auth = {
    username : user_id,
    password : secret_key
  };

  this._rest = {
    host : (options.rest_host || DEFAULT_REST_HOST),
    base : (options.rest_base || DEFAULT_REST_BASE)
  };

  // Import resources
  this.__importResources();
};


/**
 * Graphmob.prototype._get
 * @protected
 * @param  {string} resource
 * @param  {object} params
 * @param  {object} query
 * @return {object} Promise object
 */
Graphmob.prototype._get = function(resource, params, query) {
  // TODO: retry wrapper

  query = (query || {});

  return new Promise(function(resolve, reject) {
    restler.get(this.__getRESTURL(resource), {
      username : this._auth.username,
      password : this._auth.password,
      query    : query
    })
      .on("success", function(response) {
        return resolve(response.data);
      })
      .on("error", function(error) {
        return reject(error);
      })
      .on("fail", function(error) {
        return reject(new Error(error.reason));
      });
  });
};


/**
 * Graphmob.prototype.__getRESTURL
 * @private
 * @param  {string} resource
 * @return {string} REST URL
 */
Graphmob.prototype.__getRESTURL = function(resource) {
  return this._rest.host + this._rest.base + resource;
};


/**
 * Graphmob.prototype.__importResources
 * @protected
 * @return {undefined}
 */
Graphmob.prototype.__importResources = function() {
  this._resources = {};

  for (var i = 0; i < RESOURCES.length; i++) {
    var resource = RESOURCES[i];

    this._resources[resource] = require("./resources/" + resource + ".js");
  }
};


exports.default = Graphmob;
