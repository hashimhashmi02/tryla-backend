const { z } = require('zod');

const AvailabilityEnum = z.enum(['IN_STOCK', 'OUT_OF_STOCK']);
const strArr = z.array(z.string());

exports.createProductSchema = z.object({
  title:        z.string().min(1, 'title is required'),
  description:  z.string().optional().default(''),
  price: z.coerce.number({ invalid_type_error: 'price must be a number' })
          .positive('price must be > 0'),

  stock: z.coerce.number().int().nonnegative().optional().default(0),

  images:       strArr.optional().default([]),
  sizes:        strArr.optional().default([]),
  categoryId:   z.string().min(1, 'categoryId is required'),
  availability: AvailabilityEnum.optional().default('IN_STOCK'),
  features:     strArr.optional().default([]),

  material:     z.string().optional(),
  careInstructions: z.string().optional(),
  fit:          z.string().optional(),
  length:       z.string().optional(),
}).strict();

exports.updateProductSchema = exports.createProductSchema.partial().strict();
