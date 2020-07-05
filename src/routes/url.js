const express = require('express');
const { nanoid } = require('nanoid');

const { Url } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  console.log('##### req', req);
  console.log('##### req.headers', req.headers);
  const { url } = req.body;
  const slug = nanoid(10);
  try {
    const result = await Url.create({ slug, url });
    res.json({
      slug: result.slug,
      shortenedUrl: `${req.headers.origin}/${result.slug}`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
