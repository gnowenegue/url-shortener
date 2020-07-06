const db = require('../db');
const Joi = require('@hapi/joi');

const schema = Joi.object({
  slug: Joi.string().trim().required(),
  url: Joi.string().trim().uri().required(),
});

const urls = db.get('urls');
urls.createIndex('slug', { unique: true });

function create(url) {
  if (!url.url.startsWith('http://') && !url.url.startsWith('https://')) {
    url.url = `https://${url.url}`;
  }

  const { value, error } = schema.validate(url);
  if (error) {
    throw new Error(error);
  } else {
    return urls.insert(url);
  }
}

function find(slug) {
  return urls.findOne({ slug });
}

function get(limit = 10, skip = 0) {
  return urls.find({}, { limit, skip: limit * skip, sort: { _id: -1 } });
}

function count() {
  return urls.count();
}

module.exports = {
  create,
  find,
  get,
  count,
};
