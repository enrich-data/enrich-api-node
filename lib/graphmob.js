/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var restler    = require("restler");

var __Promise  = (
  (typeof Promise !== "undefined") ?
    Promise : require("es6-promise-polyfill").Promise
);


var DEFAULT_REST_HOST = "https://api.graphmob.com";
var DEFAULT_REST_BASE = "/v1";
var DEFAULT_TIMEOUT = 5000;

var PROCESSING_STATUS_CODE = 102;
var NOT_FOUND_STATUS_CODE = 404;
var PROCESSING_RETRY_WAIT = 5000;
var PROCESSING_RETRY_COUNT_MAX = 2;

var RESOURCES = [
  "Search",
  "Verify",
  "Enrich"
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
  this.__auth = {
    username : user_id,
    password : secret_key
  };

  this.__rest = {
    host : (options.rest_host || DEFAULT_REST_HOST),
    base : (options.rest_base || DEFAULT_REST_BASE)
  };

  this.__network = {
    timeout : (options.timeout || DEFAULT_TIMEOUT)
  };

  // Parse package
  var _package = require(__dirname + "/../package.json");

  this.__useragent = _package.name + "-node/" + _package.version;

  // Import resources
  this.__importResources();
};


/**
 * Graphmob.prototype._get
 * @protected
 * @param  {string} resource
 * @param  {object} query
 * @return {object} Promise object
 */
Graphmob.prototype._get = function(resource, query) {
  var self = this;

  query = (query || {});

  return new __Promise(function(resolve, reject) {
    self.__doGet(
      resource, query, resolve, reject, 0, 0
    );
  });
};


/**
 * Graphmob.prototype._get
 * @protected
 * @param  {string}   resource
 * @param  {object}   query
 * @param  {function} resolve
 * @param  {function} reject
 * @param  {number}   retry_count
 * @param  {number}   hold_for_ms
 * @return {object}   Promise object
 */
Graphmob.prototype.__doGet = function(
  resource, query, resolve, reject, retry_count, hold_for_ms
) {
  var self = this;

  // Abort?
  if (retry_count > PROCESSING_RETRY_COUNT_MAX) {
    reject({
      reason  : "not_found",
      message : "The requested item was not found, after attempted discovery."
    });
  } else {
    setTimeout(function() {
      restler.get(self.__getRESTURL(resource), {
        username           : self.__auth.username,
        password           : self.__auth.password,
        timeout            : self.__network.timeout,
        rejectUnauthorized : true,

        query              : query,

        headers            : {
          "User-Agent" : self.__useragent
        }
      })
        .on("success", function(data, response) {
          // Request is processing? Retry over a few seconds.
          if (response.statusCode === PROCESSING_STATUS_CODE) {
            self.__doGet(
              resource, query, resolve, reject, ++retry_count,
                PROCESSING_RETRY_WAIT
            );

            return;
          }

          return resolve(data);
        })
        .on("error", function(error) {
          return reject({
            reason  : "error",
            message : (error || "Request could not be submitted.")
          });
        })
        .on("timeout", function() {
          return reject({
            reason  : "timed_out",
            message : "The request processing took too much time."
          });
        })
        .on("fail", function(error, response) {
          // Request processing but still not found? Retry over a few seconds.
          if (response.statusCode === NOT_FOUND_STATUS_CODE  &&
                retry_count > 0) {
            self.__doGet(
              resource, query, resolve, reject, ++retry_count,
                PROCESSING_RETRY_WAIT
            );

            return;
          }

          return reject({
            reason  : ((error.error || {}).reason || "error"),
            message : ((error.error || {}).message || "Unknown error reason.")
          });
        });
    }, hold_for_ms);
  }
};


/**
 * Graphmob.prototype.__getRESTURL
 * @private
 * @param  {string} resource
 * @return {string} REST URL
 */
Graphmob.prototype.__getRESTURL = function(resource) {
  return this.__rest.host + this.__rest.base + resource;
};


/**
 * Graphmob.prototype.__importResources
 * @protected
 * @return {undefined}
 */
Graphmob.prototype.__importResources = function() {
  for (var i = 0; i < RESOURCES.length; i++) {
    var resource = RESOURCES[i];

    var klass = (
      require("./resources/" + resource.toLowerCase() + ".js").default
    );

    this[resource] = new klass(this);
  }
};


exports.Graphmob = Graphmob;
