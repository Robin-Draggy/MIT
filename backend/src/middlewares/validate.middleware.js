// src/middlewares/validate.middleware.js
module.exports = function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
    req.validated = result.data;
    return next();
  };
};