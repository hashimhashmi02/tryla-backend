const service = require('./product.service');

exports.getFilters = async (_req, res, next) => {
  try {
    const filters = await service.getFilters();
    res.json(filters);
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await service.list(req.query);
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await service.getOne(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await service.create(req.body);
    res.json(item);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.body);
    res.json(item);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
