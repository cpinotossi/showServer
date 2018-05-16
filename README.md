# showserver
Node.js Express Server which does show the incoming request on the console.

## Installation

    $ npm install showServer --save

##How to use?

```js
#!/usr/bin/env node

/**
 * Module dependencies.
 */
var showServer = require('showServer');

//Start server by either passing two arguments port for http and port for https or keep default ports 80,443
showServer.start(8080,8443);
```

## How to run the server?
If we assume that you did implement showServer inside the app.js file you can start it as follow:

    $ node app.js

Note: In case you are using port 80 or 443 you maybe will need to use sudo to allow showServer to listen on this ports.

    $ sudo node app.js
    
## How to send request to the showServer?
you can test it via cURL on port 80.
You can use whatever path you like to use, the outcome will always be the same:
the showserver will just replay to you all the details about the HTTP request you did send:
```
curl http://localhost/blablabla -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> GET /blablabla HTTP/1.1
> Host: localhost
> User-Agent: curl/7.58.0
> Accept: */*
> Pragma: akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-get-extracted-values
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 239
< ETag: W/"ef-pUR1aKRFi/PNg23STAv+vvimEg8"
< Date: Wed, 16 May 2018 17:09:42 GMT
< Connection: keep-alive
<
"/blablabla"
{
    "host": "localhost",
    "user-agent": "curl/7.58.0",
    "accept": "*/*",
    "pragma": "akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-get-extracted-values"
* Connection #0 to host localhost left intact
}
```
Same counts also for POST request:
```
curl -d test:test http://localhost/blablabla -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> POST /blablabla HTTP/1.1
> Host: localhost
> User-Agent: curl/7.58.0
> Accept: */*
> Pragma: akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-get-extracted-values
> Content-Length: 9
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 9 out of 9 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 347
< ETag: W/"15b-zyCJ3FIqEjbHUfsomTS+nHIyV4E"
< Date: Wed, 16 May 2018 17:10:05 GMT
< Connection: keep-alive
<
"/blablabla"
{
    "host": "localhost",
    "user-agent": "curl/7.58.0",
    "accept": "*/*",
    "pragma": "akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-get-extracted-values",
    "content-length": "9",
    "content-type": "application/x-www-form-urlencoded"
}
{
    "test:test": ""
* Connection #0 to host localhost left intact
}
```
Hand you can do it even via HTTPS.
IMPORTANT: Please not that showserver does use a self signed certificate which you will need to accept.
In case of cURL we use the flag -k to ignor certification warnings:
```
curl -d test:test https://localhost/blablabla -v -k
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /usr/local/etc/openssl/cert.pem
  CApath: /usr/local/etc/openssl/certs
* TLSv1.2 (OUT), TLS header, Certificate Status (22):
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=sample.host.com
*  start date: May 16 13:52:12 2018 GMT
*  expire date: May 16 13:52:12 2019 GMT
*  issuer: CN=sample.host.com
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
> POST /blablabla HTTP/1.1
> Host: localhost
> User-Agent: curl/7.58.0
> Accept: */*
> Pragma: akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-get-extracted-values
> Content-Length: 9
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 9 out of 9 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 347
< ETag: W/"15b-zyCJ3FIqEjbHUfsomTS+nHIyV4E"
< Date: Wed, 16 May 2018 17:13:42 GMT
< Connection: keep-alive
<
"/blablabla"
{
    "host": "localhost",
    "user-agent": "curl/7.58.0",
    "accept": "*/*",
    "pragma": "akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-get-extracted-values",
    "content-length": "9",
    "content-type": "application/x-www-form-urlencoded"
}
{
    "test:test": ""
* Connection #0 to host localhost left intact
}
```

## How to rotate the Keys of the used Ceritificate?
NOTE: You will need to have openssl installed on your machine to make this operation work:
1. Create server certificate:
```
openssl req -x509 -passin pass:"test123" -passout pass:"test123" -newkey rsa:2048 -keyout tmp.key.pem -out cert.pem -days 365 -subj "/CN=sample.host.com"
```
2. Remove password protection from key.pem:
```
openssl rsa -passin pass:"test123" -in tmp.key.pem -out key.pem && rm -f tmp.key.pem
```