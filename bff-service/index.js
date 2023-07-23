const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(
  '/product-api',
  proxy.createProxyMiddleware({
    target: 'https://wfvhgvxizg.execute-api.eu-central-1.amazonaws.com/dev',
    changeOrigin: true,
    pathRewrite: {
      '^/product-api': '',
    },
  })
);

app.use(
  '/cart-api',
  proxy.createProxyMiddleware({
    target:
      'http://mark-karnaukh-cart-api-dev.eu-central-1.elasticbeanstalk.com/api',
    changeOrigin: true,
    pathRewrite: {
      '^/cart-api': '',
    },
  })
);

app.all('/*', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
