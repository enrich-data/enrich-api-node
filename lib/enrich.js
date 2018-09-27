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


var DEFAULT_REST_HOST = "https://api.enrich.email";
var DEFAULT_REST_BASE = "/v1";
var DEFAULT_TIMEOUT = 40000;

var RESOURCES = [
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
      resource, query, resolve, reject
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
 * @return {object}   Promise object
 */
Enrich.prototype.__doGet = function(resource, query, resolve, reject) {
  restler.get(this.__getRESTURL(resource), {
    username           : this.__auth.username,
    password           : this.__auth.password,
    timeout            : this.__network.timeout,
    rejectUnauthorized : true,

    query              : query,

    headers            : {
      "User-Agent" : this.__useragent
    }
  })
    .on("success", function(data) {
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
      return reject({
        reason  : ((error.error || {}).reason || "error"),
        message : ((error.error || {}).message || "Unknown error reason.")
      });
    });
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
