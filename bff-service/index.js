import { CART_API_SERVICE_KEY, PRODUCT_API_SERVICE_KEY } from './constants.js';

import express from 'express';
import proxy from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.use(
  `/${PRODUCT_API_SERVICE_KEY}`,
  proxy.createProxyMiddleware({
    target: 'https://wfvhgvxizg.execute-api.eu-central-1.amazonaws.com/dev',
    changeOrigin: true,
    pathRewrite: {
      [`^/${PRODUCT_API_SERVICE_KEY}`]: '',
    },
  })
);

app.use(
  `/${CART_API_SERVICE_KEY}`,
  proxy.createProxyMiddleware({
    target:
      'http://mark-karnaukh-cart-api-dev.eu-central-1.elasticbeanstalk.com/api',
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
  console.log(`Example app listening on port ${port}`);
});
