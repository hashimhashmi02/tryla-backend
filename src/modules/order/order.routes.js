// src/modules/order/order.routes.js
const router = require('express').Router()
const ctrl   = require('./order.controller')
const auth   = require('../../middlewares/auth')

// all routes require auth
router.use(auth())

router.post('/checkout',        ctrl.checkout)
router.get('/',                 ctrl.list)
router.get('/:id',              ctrl.getOne)

// only ADMIN can update status
router.patch('/:id/status', auth('ADMIN'), ctrl.updateStatus)

module.exports = router
