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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/:slug', async (req, res, next) => {
  try {
    const result = await Url.find(req.params.slug);
    if (result) {
      res.redirect(result.url);
    } else {
      res.status(404);
      throw new Error('URL not found.');
    }
  } catch (error) {
    next(error);
  }
});

app.use('/url', urlRoutes);

app.use((req, res, next) => {
  res.status(404);
  next(new Error('Page not found.'));
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error(err);

  res.json({
    success: false,
    errorMessage: 'Error has occurred.',
    statusCode,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
