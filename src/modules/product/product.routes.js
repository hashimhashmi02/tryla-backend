const router     = require('express').Router();
const controller = require('./product.controller');
const auth       = require('../../middlewares/auth');
const IORedis    = require('ioredis');
const redis      = new IORedis(process.env.REDIS_URL);
const cache      = require('../../middlewares/cache');

// — PUBLIC — cache reads
router.get('/',    cache, controller.list);
router.get('/:id', cache, controller.getOne);

// — ADMIN — invalidate cache on writes

// Create
router.post('/', auth('ADMIN'), async (req, res, next) => {
  try {
    const item = await controller.create(req, res, next);
    await redis.del('/products');
    await redis.del('/products/filters');
    return res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update
router.patch('/:id', auth('ADMIN'), async (req, res, next) => {
  try {
    const item = await controller.update(req, res, next);
    await redis.del('/products');
    await redis.del('/products/filters');
    await redis.del(`/products/${req.params.id}`);
    return res.json(item);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', auth('ADMIN'), async (req, res, next) => {
  try {
    await controller.remove(req, res, next);
    await redis.del('/products');
    await redis.del('/products/filters');
    await redis.del(`/products/${req.params.id}`);
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
