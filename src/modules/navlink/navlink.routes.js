const router   = require('express').Router();
const ctrl     = require('./navlink.controller');
const auth     = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  createNavLinkSchema,
  updateNavLinkSchema
} = require('./navlink.schema');

router.get('/', ctrl.list);


router.post(
  '/',
  auth('ADMIN'),
  validate(createNavLinkSchema),
  ctrl.create
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validate(updateNavLinkSchema),
  ctrl.update
);

router.delete(
  '/:id',
  auth('ADMIN'),
  ctrl.remove
);

module.exports = router;
