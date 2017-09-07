# graphmob-api-node

The Graphmob API NodeJS wrapper. Enrich, Search and Verify data from your NodeJS services.

Copyright 2017 Graphmob. See LICENSE for copying information.

* **📝 Implements**: [Graphmob REST API ~ v1](https://docs.graphmob.com/v1/) at reference revision: 07/24/2017
* **😘 Maintainer**: [@valeriansaliou](https://github.com/valeriansaliou)

## Usage

```javascript
var Graphmob = require("graphmob-api-node").Graphmob;
```

Construct a new authenticated Graphmob client with your `user_id` and `secret_key` tokens (you can generate those from your Graphmob Dashboard, [see the docs](https://docs.graphmob.com/v1/)).

```javascript
var client = new Graphmob("ui_xxxxxx", "sk_xxxxxx");
```

Then, consume the client eg. to enrich an email address:

```javascript
api.Enrich.Email({
  email: "valerian@crisp.chat"
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

To authenticate against the API, generate your tokens (`user_id` and `secret_key`) **once** from your [Graphmob Dashboard](https://dashboard.graphmob.com/).

Then, pass those tokens **once** when you instanciate the Graphmob client as following:

```javascript
// Make sure to replace 'user_id' and 'secret_key' with your tokens
var client = new Graphmob("user_id", "secret_key");
```

## Resource Methods

This library implements all methods the Graphmob API provides. See the [API docs](https://docs.graphmob.com/v1/) for a reference of available methods, as well as how returned data is formatted.

### Search API

#### Lookup Companies

* **Method:** `api.Search.LookupCompanies(query, page_number)`
* **Docs:** [https://docs.graphmob.com/#lookup-companies](https://docs.graphmob.com/#lookup-companies)

```javascript
api.Search.LookupCompanies({
  legal_name : "Crisp IM, Inc.",
  founded    : 2015
}, 1);
```

#### Lookup Emails

* **Method:** `api.Search.LookupEmails(query, page_number)`
* **Docs:** [https://docs.graphmob.com/#lookup-emails](https://docs.graphmob.com/#lookup-emails)

```javascript
api.Search.LookupEmails({
  email_domain : "crisp.chat"
}, 1);
```

#### Suggest Companies

* **Method:** `api.Search.SuggestCompanies(query, page_number)`
* **Docs:** [https://docs.graphmob.com/#suggest-companies](https://docs.graphmob.com/#suggest-companies)

```javascript
api.Search.SuggestCompanies({
  company_name : "Crisp"
}, 1);
```

### Verify API

#### Validate an Email

* **Method:** `api.Verify.ValidateEmail(query)`
* **Docs:** [https://docs.graphmob.com/#validate-an-email](https://docs.graphmob.com/#validate-an-email)

```javascript
api.Verify.ValidateEmail({
  email : "valerian@crisp.chat"
});
```

#### Format an Email

* **Method:** `api.Verify.FormatEmail(query)`
* **Docs:** [https://docs.graphmob.com/#format-an-email](https://docs.graphmob.com/#format-an-email)

```javascript
api.Verify.FormatEmail({
  email_domain : "crisp.chat",
  first_name   : "Valerian",
  last_name    : "Saliou"
});
```

### Enrich API

#### Enrich a Person

* **Method:** `api.Enrich.Person(query)`
* **Docs:** [https://docs.graphmob.com/#enrich-a-person](https://docs.graphmob.com/#enrich-a-person)

```javascript
api.Enrich.Person({
  email : "valerian@crisp.chat"
});
```

#### Enrich a Company

* **Method:** `api.Enrich.Company(query)`
* **Docs:** [https://docs.graphmob.com/#enrich-a-company](https://docs.graphmob.com/#enrich-a-company)

```javascript
api.Enrich.Company({
  legal_name : "Crisp IM, Inc."
});
```

#### Enrich a Network

* **Method:** `api.Enrich.Network(query)`
* **Docs:** [https://docs.graphmob.com/#enrich-a-network](https://docs.graphmob.com/#enrich-a-network)

```javascript
api.Enrich.Network({
  ip : "178.62.89.169"
});
```
