const { z } = require('zod');

exports.createNavLinkSchema = z.object({
  label: z.string().min(1),
  url:   z.string().url(),
  order: z.number().int().nonnegative()
});

exports.updateNavLinkSchema = exports.createNavLinkSchema.partial();
