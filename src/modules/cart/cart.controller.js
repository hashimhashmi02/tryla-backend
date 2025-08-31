const service = require('./cart.service');

exports.list = async (req, res, next) => {
  try {
    const cart = await service.getCart(req.user.id);
    res.json({ ok: true, data: cart });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size } = req.body;     // <-- read size
    const item = await service.create(req.user.id, productId, quantity, size);
    res.status(201).json({ ok: true, data: item });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.body.quantity);
    res.json({ ok: true, data: item });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true, data: null });
  } catch (e) { next(e); }
};
