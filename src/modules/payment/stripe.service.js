const Stripe       = require('stripe');
const stripe       = Stripe(process.env.STRIPE_SECRET_KEY);
const { PrismaClient, OrderStatus } = require('@prisma/client');
const prisma       = new PrismaClient();

exports.createPaymentIntent = async (orderId)=>{
    const order = await prisma.order.findUnique({
        where:{id: orderId}});  //fetch order total
        if(!order) throw new Error('Order not found');

    const amount = Math.round(Number(order.total)*100);

    return stripe.createPaymentIntent.create({
        amount,
        currency: 'usd',
        metadata: {orderId},
    });

};


exports.handleWebhookEvent = async(event)=>{
    if(event.type === 'payment_intnet.succeeded'){
        const intent = event.data.object;
        const orderId = intent.metadata.orderId;
        await prisma.order.update({
            where:{id:orderId},
            data:{status:OrderStatus,COMPLETED}
        });
    }
}
