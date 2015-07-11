BVA - SHOPIFY - HEIST
=====================

## How to use it



Here are its configs in `Gruntfile.js` :

```javascript
shopify: {
  options: {
    api_key: process.env.API_KEY,
    password: process.env.PASSWORD,
    url: "your.shopify.url",
    base: "deploy/"
  }
},
```
Replace `your.shopify.url` with your shop’s actual URL. 
Open up a console in the project’s root directory, run `grunt`, and you’re good to go!

