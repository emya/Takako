"use strict";var precacheConfig=[["/static/bundles/css/main.7940026b.css","e60303420ebbc141dfdb83ffe21c0e53"],["/static/bundles/index.html","514506ddbfe2634136685ccc3be916e1"],["/static/bundles/js/main.f9175054.js","7fd8a14d36714707de45b1971027d5ca"],["/static/bundles/media/Chiaki.d1177fc2.png","d1177fc2215c8401b19ccb4dd5fc7d04"],["/static/bundles/media/Emi.590da3f8.png","590da3f8becafc0a5c35efbb9ed6ae58"],["/static/bundles/media/clothes.7eb28bd3.png","7eb28bd346f21e2a27235241ff115e71"],["/static/bundles/media/cosme.96736768.png","96736768f38deb8e67214fbe7015b84f"],["/static/bundles/media/default.0b0a90e9.png","0b0a90e92834bcc7a698b01a0844c5f6"],["/static/bundles/media/lp-mobile.73f71860.png","73f71860671990070b7dbd690fa65485"],["/static/bundles/media/requester1.80630574.png","8063057432fa6178732841d913113537"],["/static/bundles/media/requester2.818d4230.png","818d42303fd54108a6348c280320f483"],["/static/bundles/media/style.12bb5995.scss","12bb5995388932fc87702e838058494e"],["/static/bundles/media/style_LP.55569e44.scss","55569e4468b09157ddaa4604c8c5e6ce"],["/static/bundles/media/top4.a89c1a46.png","a89c1a46cfdc7ff9f8abf34f838bac78"],["/static/bundles/media/traveler1.f253a4b4.png","f253a4b4c2bf1ad2303fbc5f8d30ddd0"],["/static/bundles/media/traveler2.9d8529bf.png","9d8529bf675c114de7ac6957216a0706"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),r=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var a=new Request(n,{credentials:"same-origin"});return fetch(a).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(n=new URL("/static/bundles/index.html",self.location).toString(),t=urlsToCacheKeys.has(n)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});