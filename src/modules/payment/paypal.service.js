const { client, checkout } = require('./paypal.client');
const { PrismaClient }     = require('@prisma/client');
const prisma               = new PrismaClient();

exports.createOrder = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });


  const purchaseUnit = {
    amount: {
      currency_code: 'USD',
      value: order.total.toFixed(2)
    },
    invoice_id: orderId
  };


  const request = new checkout.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [purchaseUnit]
  });

  const response = await client.execute(request);
  return response.result;  
};

exports.captureOrder = async (paypalOrderId, orderId) => {
  
  const request = new checkout.orders.OrdersCaptureRequest(paypalOrderId);
  request.requestBody({});  // must be empty
  const capture = await client.execute(request);

 
  await prisma.order.update({
    where: { id: orderId },
    data:  { status: 'PAID' }
  });

  return capture.result;
};
