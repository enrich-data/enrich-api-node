/*
 * enrich-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


/**
 * Verify
 * @class
 * @classdesc  Instanciates Verify resources.
 * @param      {object} parent
 */
var Verify = function(parent) {
  this.parent = parent;
};


/**
 * Verify.prototype.ValidateEmail
 * @public
 * @param  {object} query
 * @return {object} Promise object
 */
Verify.prototype.ValidateEmail = function(query) {
  return this.parent._get("/verify/validate/email", query);
};


exports.default = Verify;
