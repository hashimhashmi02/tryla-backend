const { ZodError } = require('zod');

module.exports = schema => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: err.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next(err);
  }
};
