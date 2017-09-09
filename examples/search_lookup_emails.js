/*
 * graphmob-api-node
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var Graphmob = require("graphmob-api").Graphmob;


var client = new Graphmob(
  "ui_a311da78-6b89-459c-8028-b331efab20d5",
  "sk_f293d44f-675d-4cb1-9c78-52b8a9af0df2"
);


client.Search.LookupEmails({
  email_domain : "crisp.chat"
}, 1)
  .then(console.info)
  .catch(console.error);
