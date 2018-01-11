"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/index.html","e80f7d92a2ecb420507487c5ae16e33e"],["/static/css/main.d7573c72.css","17a6cd1ac0d135466afb49a68f47e161"],["/static/js/main.9512a54d.js","ebce7b19f927f7f488a83db41de56c20"],["/static/media/austinMap.7445b329.png","7445b329d3cf1805d19edc8359b61ca7"],["/static/media/exampleCredit(1).aa729cdd.png","aa729cdd53958428787e5649870930c8"],["/static/media/exampleCredit(2).92a58f15.png","92a58f15df140435f12d060136cce678"],["/static/media/exampleCredit(3).2c2350aa.png","2c2350aa61429f020a2bea132d30add5"],["/static/media/exampleCredit(4).477711bd.png","477711bddae0c5169c68684c0d3c71a6"],["/static/media/exampleCriminal(1).0465955e.png","0465955e23a9130fca1fe5b3fc7b4001"],["/static/media/exampleCriminal(2).7df9e741.png","7df9e741a5d6e084542ec442ce1eac62"],["/static/media/exampleId(2).19a06e76.png","19a06e764e0dd23901a43a83dd3ba8bb"],["/static/media/examplePay(1).6752d11b.png","6752d11b19ea8bdc34fc3259e34b6740"],["/static/media/inlineLogo.d4ca580d.png","d4ca580de3b8cb6640c4901f1cdb2fd5"],["/static/media/step1.ff7e5b7a.png","ff7e5b7a3bcc6f4b4176c8f8a1062a4a"],["/static/media/step2.274dcb12.png","274dcb1242111b75841828dd392dbc6c"],["/static/media/step3.7dc47963.png","7dc47963d250a80044cc6a449ed5fda0"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,t,a,n){var r=new URL(e);return n&&r.pathname.match(n)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),r=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),r]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var n=new Request(a,{credentials:"same-origin"});return fetch(n).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),n="index.html";(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),t=urlsToCacheKeys.has(a));var r="/index.html";!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(a=new URL(r,self.location).toString(),t=urlsToCacheKeys.has(a)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});