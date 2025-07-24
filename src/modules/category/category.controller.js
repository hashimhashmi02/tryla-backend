const service = require('./category.service');

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.json(data);
  } catch (e) { next(e); }
};

exports.list = async (_req, res, next) => {
  try {
    const data = await service.list();
    res.json(data);
  } catch (e) { next(e); }
};
