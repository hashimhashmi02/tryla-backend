const service = require('./order.service');

exports.checkout = async (req,res,next) => {
  try {
    const order = await service.createOrder(req.user.id);
    res.json(order);
  } catch(e){ next(e); }
};

exports.listOrders = async (req,res,next) => {
  try {
    const orders = await service.listOrders(req.user);
    res.json(orders);
  } catch(e){ next(e); }
};

exports.getOrder = async (req,res,next) => {
  try {
    const order = await service.getOrder(req.user, req.params.id);
    if (!order) return res.status(404).json({ msg: 'Not found' });
    res.json(order);
  } catch(e){ next(e); }
};

exports.updateStatus = async (req,res,next) => {
  try {
    const updated = await service.updateStatus(req.params.id, req.body.status);
    res.json(updated);
  } catch(e){ next(e); }
};
