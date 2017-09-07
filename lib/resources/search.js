/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


/**
 * Search
 * @class
 * @classdesc  Instanciates Search resources.
 * @param      {object} parent
 */
var Search = function(parent) {
  this.parent = parent;
};


/**
 * Search.prototype.LookupCompanies
 * @public
 * @param  {number} page_number
 * @param  {object} query
 * @return {object} Promise object
 */
Search.prototype.LookupCompanies = function(page_number, query) {
  return this.parent._get(
    "/search/lookup/companies/" + page_number,

    {
      page_number : page_number
    },

    query
  );
};


/**
 * Search.prototype.LookupEmails
 * @public
 * @param  {number} page_number
 * @param  {object} query
 * @return {object} Promise object
 */
Search.prototype.LookupEmails = function(page_number, query) {
  return this.parent._get(
    "/search/lookup/emails/" + page_number,

    {
      page_number : page_number
    },

    query
  );
};


/**
 * Search.prototype.SuggestCompanies
 * @public
 * @param  {number} page_number
 * @param  {object} query
 * @return {object} Promise object
 */
Search.prototype.SuggestCompanies = function(page_number, query) {
  return this.parent._get(
    "/search/suggest/companies/" + page_number,

    {
      page_number : page_number
    },

    query
  );
};


exports.default = Search;
