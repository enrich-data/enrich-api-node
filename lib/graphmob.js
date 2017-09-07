/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


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
};


exports.Graphmob = Graphmob;
