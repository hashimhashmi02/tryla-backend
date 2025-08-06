const service = require('./cart.service');

exports.list = async (req, res, next) => {
  try {
    const cart = await service.getCart(req.user.id);
    res.json({ ok: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const item = await service.create(req.user.id, productId, quantity);
    res.status(201).json({ ok: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await service.update(req.params.id, quantity);
    res.json({ ok: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true, data: null });
  } catch (err) {
    next(err);
  }
};
