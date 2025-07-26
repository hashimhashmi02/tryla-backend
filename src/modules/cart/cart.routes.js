const router     = require('express').Router();
const ctrl       = require('./cart.controller');
const auth       = require('../../middlewares/auth');

router.use(auth());  

router.get('/',      ctrl.getCart);               // GET    /cart
router.post('/',     ctrl.addItem);               // POST   /cart      { productId, quantity }
router.patch('/:id', ctrl.updateItem);            // PATCH  /cart/:id  { quantity }
router.delete('/:id',ctrl.removeItem);            // DELETE /cart/:id

module.exports = router;
