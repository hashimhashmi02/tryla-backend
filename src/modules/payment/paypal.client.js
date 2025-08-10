const checkout = require('@paypal/checkout-server-sdk');


function environment() {
  return process.env.PAYPAL_MODE === 'live'
    ? new checkout.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new checkout.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
}

const client = new checkout.core.PayPalHttpClient(environment());

module.exports = { client, checkout };
