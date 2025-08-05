const service = require('./navlink.service');

exports.list = async (_req, res, next) => {
  try {
    const data = await service.list();
    res.json({ ok: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await service.create(req.validated);
    res.status(201).json({ ok: true, data: item });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.validated);
    res.json({ ok: true, data: item });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true, data: null });
  } catch (err) { next(err); }
};
