import { CART_API_SERVICE_KEY, PRODUCT_API_SERVICE_KEY } from './constants.js';

import express from 'express';
import proxy from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use(
  `/${PRODUCT_API_SERVICE_KEY}`,
  proxy.createProxyMiddleware({
    target: process.env[PRODUCT_API_SERVICE_KEY],
    changeOrigin: true,
    pathRewrite: {
      [`^/${PRODUCT_API_SERVICE_KEY}`]: '',
    },
  })
);

app.use(
  `/${CART_API_SERVICE_KEY}`,
  proxy.createProxyMiddleware({
    target: process.env[CART_API_SERVICE_KEY],
    changeOrigin: true,
    pathRewrite: {
      [`^/${CART_API_SERVICE_KEY}`]: '',
    },
  })
);

app.all('/*', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`BFF service app listening on port ${port}`);
});
