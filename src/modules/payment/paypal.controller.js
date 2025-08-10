const service = require('./paypal.service');

exports.createPayPalOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) throw Object.assign(new Error('orderId is required'), { status: 400 });
    const ppOrder = await service.createOrder(orderId);
    res.json({ ok: true, data: ppOrder });
  } catch (err) { next(err); }
};

exports.capturePayPalOrder = async (req, res, next) => {
  try {
    const { paypalOrderId, orderId } = req.body;
    if (!paypalOrderId || !orderId) {
      throw Object.assign(new Error('paypalOrderId & orderId are required'), { status: 400 });
    }
    const capture = await service.captureOrder(paypalOrderId, orderId);
    res.json({ ok: true, data: capture });
  } catch (err) { next(err); }
};
