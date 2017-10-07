/*
 * enrich-api-node
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


var DEFAULT_REST_HOST = "https://api.enrichdata.com";
var DEFAULT_REST_BASE = "/v1";
var DEFAULT_TIMEOUT = 5000;

var CREATED_STATUS_CODE = 201;
var NOT_FOUND_STATUS_CODE = 404;
var CREATED_RETRY_COUNT_MAX = 2;

var RESOURCES = [
  "Search",
  "Verify",
  "Enrich"
];


/**
 * Enrich
 * @class
 * @classdesc  Instanciates a new Enrich connector.
 * @param      {object} options
 */
var Enrich = function(userID, secretKey, options) {
  options = (options || {});

  // Sanitize options
  if (typeof userID !== "string" || !userID) {
    throw new Error("Invalid or missing userID");
  }
  if (typeof secretKey !== "string" || !secretKey) {
    throw new Error("Invalid or missing secretKey");
  }

  // Prepare storage
  this.__auth = {
    username : userID,
    password : secretKey
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
 * Enrich.prototype._get
 * @protected
 * @param  {string} resource
 * @param  {object} query
 * @return {object} Promise object
 */
Enrich.prototype._get = function(resource, query) {
  var self = this;

  query = (query || {});

  return new __Promise(function(resolve, reject) {
    self.__doGet(
      resource, query, resolve, reject, 0, 0
    );
  });
};


/**
 * Enrich.prototype._get
 * @protected
 * @param  {string}   resource
 * @param  {object}   query
 * @param  {function} resolve
 * @param  {function} reject
 * @param  {number}   retryCount
 * @param  {number}   holdForMS
 * @return {object}   Promise object
 */
Enrich.prototype.__doGet = function(
  resource, query, resolve, reject, retryCount, holdForMS
) {
  var self = this;

  // Abort?
  if (retryCount > CREATED_RETRY_COUNT_MAX) {
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
          // Resource was created? Retry over a few seconds.
          if (response.statusCode === CREATED_STATUS_CODE) {
            // Acquire Retry-After header value for 'holdForMS'
            var retryAfter = response.headers["retry-after"];

            if (retryAfter) {
              holdForMS = parseInt(retryAfter, 10) * 1000;
            }

            self.__doGet(
              resource, query, resolve, reject, ++retryCount, holdForMS
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
          // Resource created but still not found? Retry over a few seconds.
          if (response.statusCode === NOT_FOUND_STATUS_CODE && retryCount > 0) {
            self.__doGet(
              resource, query, resolve, reject, ++retryCount, holdForMS
            );

            return;
          }

          return reject({
            reason  : ((error.error || {}).reason || "error"),
            message : ((error.error || {}).message || "Unknown error reason.")
          });
        });
    }, holdForMS);
  }
};


/**
 * Enrich.prototype.__getRESTURL
 * @private
 * @param  {string} resource
 * @return {string} REST URL
 */
Enrich.prototype.__getRESTURL = function(resource) {
  return this.__rest.host + this.__rest.base + resource;
};


/**
 * Enrich.prototype.__importResources
 * @protected
 * @return {undefined}
 */
Enrich.prototype.__importResources = function() {
  for (var i = 0; i < RESOURCES.length; i++) {
    var resource = RESOURCES[i];

    var klass = (
      require("./resources/" + resource.toLowerCase() + ".js").default
    );

    this[resource] = new klass(this);
  }
};


exports.Enrich = Enrich;
