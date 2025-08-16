const { ZodError } = require('zod');

module.exports = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
  
    req.validated = parsed;
    req.body = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Validation error',
        errors: err.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};
