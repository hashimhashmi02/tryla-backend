const service = require('./product.service');

exports.list = async (req, res, next) => {
  try {
    const data = await service.list(req.query);
    res.json(data);
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await service.getOne(req.params.id);
    if (!data) return res.status(404).json({ msg: 'Not found' });
    res.json(data);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.json(data);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
};
