const service = require('./cart.service');

exports.getCart = async (req,res,next) => {
  try {
    const items = await service.getCart(req.user.id);
    res.json(items);
  } catch(e){ next(e); }
};

exports.addItem = async (req,res,next) => {
  try {
    const { productId, quantity } = req.body;
    const item = await service.addItem(req.user.id, productId, quantity);
    res.json(item);
  } catch(e){ next(e); }
};

exports.updateItem = async (req,res,next) => {
  try {
    const item = await service.updateItem(req.user.id, req.params.id, req.body.quantity);
    res.json(item);
  } catch(e){ next(e); }
};

exports.removeItem = async (req,res,next) => {
  try {
    await service.removeItem(req.user.id, req.params.id);
    res.json({ ok: true });
  } catch(e){ next(e); }
};
