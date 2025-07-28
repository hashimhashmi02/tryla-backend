const router     = require('express').Router();
const controller = require('./category.controller');
const auth       = require('../../middlewares/auth');
const cache      = require('../../middlewares/cache');

// — ADMIN — create a new category (invalidates cache)
router.post('/', auth('ADMIN'), async (req, res, next) => {
  try {
    const category = await controller.create(req, res, next);
    // invalidate the categories list cache
    const IORedis = require('ioredis');
    const redis   = new IORedis(process.env.REDIS_URL);
    await redis.del('/categories');
    return res.json(category);
  } catch (err) {
    next(err);
  }
});

// — PUBLIC — list categories (cached for 60s)
router.get('/', cache, controller.list);

module.exports = router;
