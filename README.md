# enrich-api-node

[![Test and Build](https://github.com/enrich-data/enrich-api-node/workflows/Test%20and%20Build/badge.svg?branch=master)](https://github.com/enrich-data/enrich-api-node/actions?query=workflow%3A%22Test+and+Build%22) [![Build and Release](https://github.com/enrich-data/enrich-api-node/workflows/Build%20and%20Release/badge.svg)](https://github.com/enrich-data/enrich-api-node/actions?query=workflow%3A%22Build+and+Release%22) [![NPM](https://img.shields.io/npm/v/enrich-api.svg)](https://www.npmjs.com/package/enrich-api) [![Downloads](https://img.shields.io/npm/dt/enrich-api.svg)](https://www.npmjs.com/package/enrich-api)

The Enrich API NodeJS wrapper. Enrich, Search and Verify data from your NodeJS services.

Copyright 2017 Crisp IM SAS. See LICENSE for copying information.

* **😘 Maintainer**: [@valeriansaliou](https://github.com/valeriansaliou)

## Usage

Install the library:

```bash
npm install enrich-api --save
```

Then, import it:

```javascript
var Enrich = require("enrich-api").Enrich;
```

Construct a new authenticated Enrich client with your `user_id` and `secret_key` tokens.

```javascript
var client = new Enrich("ui_xxxxxx", "sk_xxxxxx");
```

Then, consume the client eg. to enrich an email address:

```javascript
client.Enrich.Person({
  email : "valerian@crisp.chat"
})
  .then(function(data) {
    console.info("Enriched email:", data);
  })
  .catch(function(error) {
    console.error("Failed enriching email:", error);
  });
```

_This library uses Promise for asynchronous response handling. If your NodeJS version is recent enough and has support for native promises, then the library will use native promises. Otherwise, it will fallback on a non-native implementation of promises._

## Authentication

To authenticate against the API, get your tokens (`user_id` and `secret_key`).

Then, pass those tokens **once** when you instanciate the Enrich client as following:

```javascript
// Make sure to replace 'user_id' and 'secret_key' with your tokens
var client = new Enrich("user_id", "secret_key");
```

## Data Discovery

**When Enrich doesn't know about a given data point, eg. an email that was never enriched before, it launches a discovery. Discoveries can take a few seconds, and sometimes more than 10 seconds.**

This library implements a retry logic with a timeout if the discovery takes too long, or if the item wasn't found.

Thus, you can expect some requests, especially the Enrich requests, to take more time than expected. This is normal, and is not a performance issue on your side, or on our side. Under the hood, when you request a data point (eg. enrich a person given an email) that doesn't yet exist in our databases, the Enrich API returns the HTTP response `201 Created`. Then, this library will poll the enrich resource for results, with intervals of a few seconds. The API will return `404 Not Found` as the discovery is still processing and no result is yet known at this point. Once a result is found, the API will reply with `200 OK` and return discovered data. If the discovery fails and no data can be aggregated for this email, the library aborts the retry after some time (less than 20 seconds), and returns a `not_found` error.

If a requested data point is already known by the Enrich API, it will be immediately returned, which won't induce any delay.

## Resource Methods

This library implements all methods the Enrich API provides.

### Verify API

#### Validate an Email

* **Method:** `client.Verify.ValidateEmail(query)`

```javascript
client.Verify.ValidateEmail({
  email : "valerian@crisp.chat"
});
```

### Enrich API

#### Enrich a Person

* **Method:** `client.Enrich.Person(query)`

```javascript
client.Enrich.Person({
  email : "valerian@crisp.chat"
});
```

#### Enrich a Company

* **Method:** `client.Enrich.Company(query)`

```javascript
client.Enrich.Company({
  domain : "crisp.chat"
});
```

#### Enrich a Network

* **Method:** `client.Enrich.Network(query)`

```javascript
client.Enrich.Network({
  ip : "178.62.89.169"
});
```
