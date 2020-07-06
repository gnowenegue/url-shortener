require('dotenv').config();

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { urlRoutes } = require('./routes');
const { Url } = require('./models');

const app = express();

app.use(morgan('combined'));
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost',
  })
);

app.use(express.json());

app.use('/url', urlRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (slug === 'favicon.ico') return res.sendStatus(200);
    console.log('##### slug', slug, req.params);
    const result = await Url.find(slug);
    console.log('##### result', result);
    if (result) {
      return res.redirect(result.url);
    } else {
      res.status(404);
      throw new Error('URL not found.');
    }
  } catch (error) {
    next(error);
  }
});

/* app.use((req, res, next) => {
  res.status(404);
  next(new Error('Page not found.'));
}); */

app.use((err, req, res, next) => {
  if (err.message.startsWith('ENOENT') && err.statusCode === 404) {
    return res.sendStatus(err.statusCode);
  }

  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode);

  console.error(err);

  return res.json({
    success: false,
    errorMessage: err.message.startsWith('E11000')
      ? 'Slug already exists.'
      : 'Error has occurred.',
    statusCode,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
