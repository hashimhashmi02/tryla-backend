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

exports.updateStatus = async (req, res, next) => {
  try {
    const { id }    = req.params;
    const { status } = req.body;
    const updated   = await require('./order.service').changeStatus(id, status);
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
};
