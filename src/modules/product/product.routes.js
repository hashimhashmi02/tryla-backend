// src/modules/product/product.routes.js

const router    = require('express').Router();
const auth      = require('../../middlewares/auth');
const cache     = require('../../middlewares/cache');
const IORedis   = require('ioredis');
const validate  = require('../../middlewares/validate');
const service   = require('./product.service');
const {
  createProductSchema,
  updateProductSchema
} = require('./product.schema');

const redis = new IORedis(process.env.REDIS_URL);
redis.on('error', () => {}); // ignore failures

// — PUBLIC — cache reads
router.get('/filters', cache, async (req, res, next) => {
  try {
    const data = await service.getFilters();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/', cache, async (req, res, next) => {
  try {
    const items = await service.list(req.query);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', cache, async (req, res, next) => {
  try {
    const item = await service.getOne(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// — ADMIN — invalidate cache on writes

// Create (POST /products)
router.post(
  '/',
  auth('ADMIN'),
  validate(createProductSchema),
  async (req, res, next) => {
    try {
      const item = await service.create(req.validated);
      await Promise.all([
        redis.del('/products'),
        redis.del('/products/filters'),
      ]);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

// Update (PATCH /products/:id)
router.patch(
  '/:id',
  auth('ADMIN'),
  validate(updateProductSchema),
  async (req, res, next) => {
    try {
      const item = await service.update(req.params.id, req.validated);
      await Promise.all([
        redis.del('/products'),
        redis.del('/products/filters'),
        redis.del(`/products/${req.params.id}`),
      ]);
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

// Delete (DELETE /products/:id)
router.delete(
  '/:id',
  auth('ADMIN'),
  async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      await Promise.all([
        redis.del('/products'),
        redis.del('/products/filters'),
        redis.del(`/products/${req.params.id}`),
      ]);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
