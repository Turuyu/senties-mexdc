import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  schema: z.object({
    icon: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int().nonnegative(),
  }).strict(),
});

const partners = defineCollection({
  schema: z.object({
    name: z.string().min(1),
    order: z.number().int().nonnegative(),
  }).strict(),
});

const bonds = defineCollection({
  schema: z.object({
    metric: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int().nonnegative(),
  }).strict(),
});

export const collections = { services, partners, bonds };
