import { installGlobals, createRequestHandler, writeReadableStreamToWritable } from '@remix-run/node';
import * as build from '../build/server/index.js';

installGlobals();

const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req, res) {
  try {
    const protocol = getProtocol(req);
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = new URL(req.url || '/', `${protocol}://${host}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const val of value) {
          headers.append(key, val);
        }
      } else {
        headers.set(key, value);
      }
    }

    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = req;
      init.duplex = 'half';
    }

    const request = new Request(url, init);
    const response = await handleRequest(request);

    res.statusMessage = response.statusText;
    res.statusCode = response.status;

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      await writeReadableStreamToWritable(response.body, res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

function getProtocol(req) {
  const forwarded = req.headers['x-forwarded-proto'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0];
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  return 'https';
}

