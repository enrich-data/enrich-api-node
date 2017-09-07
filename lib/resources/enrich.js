/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


/**
 * Enrich
 * @class
 * @classdesc  Instanciates Enrich resources.
 * @param      {object} parent
 */
var Enrich = function(parent) {
  this.parent = parent;
};


/**
 * Enrich.prototype.Person
 * @public
 * @param  {object} query
 * @return {object} Promise object
 */
Enrich.prototype.Person = function(query) {
  return this.parent._get("/enrich/person", {}, query);
};


/**
 * Enrich.prototype.Company
 * @public
 * @param  {object} query
 * @return {object} Promise object
 */
Enrich.prototype.Company = function(query) {
  return this.parent._get("/enrich/company", {}, query);
};


/**
 * Enrich.prototype.Network
 * @public
 * @param  {object} query
 * @return {object} Promise object
 */
Enrich.prototype.Network = function(query) {
  return this.parent._get("/enrich/network", {}, query);
};


exports.default = Enrich;
