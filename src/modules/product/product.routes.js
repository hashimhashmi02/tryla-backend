const router       = require('express').Router();
const auth         = require('../../middlewares/auth');
const cache        = require('../../middlewares/cache');
const IORedis      = require('ioredis');
const service      = require('./product.service');

const redis = new IORedis(process.env.REDIS_URL);
redis.on('error', () => { /* ignore connection failures */ });



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
    if (!item) return res.status(404).json({ msg: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});



router.post('/', auth('ADMIN'), async (req, res, next) => {
  try {
    const item = await service.create(req.body);
   
    await Promise.all([
      redis.del('/products'),
      redis.del('/products/filters')
    ]);
    res.json(item);
  } catch (err) {
    next(err);
  }
});


router.patch('/:id', auth('ADMIN'), async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.body);
    await Promise.all([
      redis.del('/products'),
      redis.del('/products/filters'),
      redis.del(`/products/${req.params.id}`)
    ]);
    res.json(item);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', auth('ADMIN'), async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    await Promise.all([
      redis.del('/products'),
      redis.del('/products/filters'),
      redis.del(`/products/${req.params.id}`)
    ]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
