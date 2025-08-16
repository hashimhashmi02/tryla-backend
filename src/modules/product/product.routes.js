const router     = require('express').Router();
const controller = require('./product.controller');
const auth       = require('../../middlewares/auth');
const cache      = require('../../middlewares/cache');
const validate   = require('../../middlewares/validate');
const { createProductSchema, updateProductSchema } = require('./product.schema');
const IORedis    = require('ioredis');

const redis = new IORedis(process.env.REDIS_URL);
redis.on('error', () => { /* ignore connection failures */ });

router.get('/filters', cache, async (req, res, next) => {
  try {
    const data = await controller.getFilters();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});


router.get('/search', cache, async (req, res, next) => {
  try {
    const items = await controller.search(req.query.q || '');
    res.json({ ok: true, data: items });
  } catch (err) {
    next(err);
  }
});


router.get('/', cache, async (req, res, next) => {
  try {
    const items = await controller.list(req.query);
    res.json({ ok: true, data: items });
  } catch (err) {
    next(err);
  }
});


router.get('/:id', cache, async (req, res, next) => {
  try {
    const item = await controller.getOne(req.params.id);
    if (!item) return res.status(404).json({ ok: false, error: 'Not Found' });
    res.json({ ok: true, data: item });
  } catch (err) {
    next(err);
  }
});


router.post(
  '/',
  auth('ADMIN'),
  validate(createProductSchema),
  async (req, res, next) => {
    try {
      const item = await controller.create(req.validated);
      await Promise.all([
        redis.del('/products'),
        redis.del('/products/filters'),
      ]);
      res.status(201).json({ ok: true, data: item });
    } catch (err) {
      next(err);
    }
  }
);


router.patch(
  '/:id',
  auth('ADMIN'),
  validate(updateProductSchema),          
  async (req, res, next) => {
    try {
      const item = await controller.update(req.params.id, req.body);
      await Promise.all([
        redis.del('/products'),
        redis.del('/products/filters'),
        redis.del(`/products/${req.params.id}`),
      ]);
      res.json({ ok: true, data: item });
    } catch (err) {
      next(err);
    }
  }
);

 
router.delete(
  '/:id',
  auth('ADMIN'),
  async (req, res, next) => {
    try {
      await controller.remove(req.params.id);
      await Promise.all([
        redis.del('/products'),
        redis.del('/products/filters'),
        redis.del(`/products/${req.params.id}`),
      ]);
      res.json({ ok: true, data: null });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
