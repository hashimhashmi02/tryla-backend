const service = require('./product.service');

exports.list = async (req, res, next) => {
  try {
    const items = await service.list(req.query);
    res.json({ ok: true, data: items });
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await service.getOne(req.params.id);
    if (!item) return res.status(404).json({ ok: false, error: 'Not Found' });
    res.json({ ok: true, data: item });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await service.create(req.validated ?? req.body);
    res.status(201).json({ ok: true, data: item });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.validated ?? req.body);
    res.json({ ok: true, data: item });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true, data: null });
  } catch (e) { next(e); }
};

exports.getFilters = async (_req, res, next) => {
  try {
    const data = await service.getFilters();
    res.json({ ok: true, data });
  } catch (e) { next(e); }
};

exports.search = async (req, res, next) => {
  try {
    const items = await service.search(req.query.q || '');
    res.json({ ok: true, data: items });
  } catch (e) { next(e); }
};
