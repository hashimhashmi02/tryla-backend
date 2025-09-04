const service = require('./order.service');
exports.checkout = async (req, res, next) => {
  try {
    const { shippingAddress, recipientName, recipientPhone } = req.body;
    if (!shippingAddress || !recipientName || !recipientPhone) {
      const err = new Error('shippingAddress, recipientName & recipientPhone are required');
      err.status = 400;
      throw err;
    }

    const order = await service.createOrder(
      req.user.id,
      shippingAddress,
      recipientName,
      recipientPhone
    );

    res.status(201).json({ ok: true, data: order });
  } catch (err) {
    next(err);
  }
};
exports.list = async (req, res, next) => {
  try {
    const orders = await service.listOrders(req.user);
    res.json({ ok: true, data: orders });
  } catch (err) {
    next(err);
  }
};
exports.listMine = async (req, res, next) => {
  try {
    const orders = await service.listMyOrders(req.user.id);
    res.json({ ok: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await service.getOrder(req.user, req.params.id);
    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });
    res.json({ ok: true, data: order });
  } catch (err) {
    next(err);
  }
};


exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      const err = new Error('Status is required');
      err.status = 400;
      throw err;
    }
    const updated = await service.updateStatus(req.params.id, status);
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
};
