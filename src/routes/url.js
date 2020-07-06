const express = require('express');
const { nanoid } = require('nanoid');

const { Url } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  let { slug, url } = req.body;
  if (!slug) slug = nanoid(10);

  try {
    const result = await Url.create({ slug, url });
    return res.json({
      slug: result.slug,
      shortenedUrl: `${req.headers.origin || ''}/${result.slug}`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let { pageSize = 10, currentPage = 0 } = req.query;
    pageSize = parseInt(pageSize);
    currentPage = parseInt(currentPage);

    const result = await Url.get(pageSize, currentPage);
    const count = await Url.count();
    return res.json({
      data: result,
      totalCount: count,
      currentPage,
      pageSize,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
