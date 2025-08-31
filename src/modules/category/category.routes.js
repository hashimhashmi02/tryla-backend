const router     = require('express').Router();
const controller = require('./category.controller');
const auth       = require('../../middlewares/auth');
const cache      = require('../../middlewares/cache');
const IORedis    = require('ioredis');

const redis = new IORedis(process.env.REDIS_URL);
redis.on('error', () => {});

// ADMIN — create
router.post('/', auth('ADMIN'), async (req, res, next) => {
  try {
    const category = await controller.create(req, res, next);
    await redis.del('/categories');
    res.json(category);
  } catch (err) { next(err); }
});

// PUBLIC — list
router.get('/', cache, controller.list);

// PUBLIC — get by id
router.get('/:id', cache, controller.getOne);

// ADMIN — edit by id
router.patch('/:id', auth('ADMIN'), async (req, res, next) => {
  try {
    const resp = await controller.update(req, res, next);
    await Promise.all([redis.del('/categories'), redis.del(`/categories/${req.params.id}`)]);
    res.json(resp);
  } catch (err) { next(err); }
});

module.exports = router;
