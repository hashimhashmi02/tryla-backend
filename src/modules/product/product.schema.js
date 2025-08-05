const {z} = require('zod');
 
const AvailabilityEnum = z.enum(['IN_STOCK','OUT_OF_STOCK']);

exports.createProductSchema = z.object({
    title:        z.string().min(1),
    description:  z.string().min(1),
    price:        z.number().positive(),
    stock:        z.number().int().nonnegative().optional().default(0),
    images:       z.array(z.string().url()).optional().default(0),
    sizes:        z.array(z.string()).optional().default([]),
    categoryId:   z.string().cuid(),
    availability: AvailabilityEnum.optional().default('IN_STOCK'),
    features:     z.array(z.string()).optional().default([]),
    material:     z.string().optional(),
    careInstructions: z.string().optional(),
    fit:           z.string().optional(),
    length:         z.string().optional(),
});
 
exports.updateProductSchema  = exports.createProductSchema.partial();