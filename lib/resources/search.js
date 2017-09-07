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
 * @param  {object} query
 * @param  {number} [page_number]
 * @return {object} Promise object
 */
Search.prototype.LookupCompanies = function(query, page_number) {
  page_number = (page_number || 1);

  return this.parent._get(
    "/search/lookup/companies/" + page_number, query
  );
};


/**
 * Search.prototype.LookupEmails
 * @public
 * @param  {object} query
 * @param  {number} [page_number]
 * @return {object} Promise object
 */
Search.prototype.LookupEmails = function(query, page_number) {
  page_number = (page_number || 1);

  return this.parent._get(
    "/search/lookup/emails/" + page_number, query
  );
};


/**
 * Search.prototype.SuggestCompanies
 * @public
 * @param  {object} query
 * @param  {number} [page_number]
 * @return {object} Promise object
 */
Search.prototype.SuggestCompanies = function(query, page_number) {
  page_number = (page_number || 1);

  return this.parent._get(
    "/search/suggest/companies/" + page_number, query
  );
};


exports.default = Search;
