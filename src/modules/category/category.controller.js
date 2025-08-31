const service = require('./category.service');

exports.create = async (req, res, next) => {
  try { res.json({ ok: true, data: await service.create(req.body) }); }
  catch (e) { next(e); }
};

exports.list = async (_req, res, next) => {
  try { res.json({ ok: true, data: await service.list() }); }
  catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const cat = await service.getOne(req.params.id);
    if (!cat) return res.status(404).json({ ok: false, error: 'Not Found' });
    res.json({ ok: true, data: cat });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try { res.json({ ok: true, data: await service.update(req.params.id, req.body) }); }
  catch (e) { next(e); }
};
