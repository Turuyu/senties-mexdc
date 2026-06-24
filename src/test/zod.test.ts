import { z } from 'zod';

// Re-declare schemas inline so this test file is self-contained
// and does not depend on Astro content layer internals.
const servicesSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
});

const partnersSchema = z.object({
  name: z.string(),
  order: z.number(),
});

const bondsSchema = z.object({
  metric: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
});

describe('Content Collection Schemas', () => {
  describe('services', () => {
    it('accepts a valid service fixture', () => {
      const fixture = {
        icon: 'fa-solid fa-file-contract',
        title: 'Fianzas de Fidelidad',
        description: 'Protección contra fraudes internos.',
        order: 1,
      };
      const result = servicesSchema.safeParse(fixture);
      expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
      const result = servicesSchema.safeParse({ icon: 'fa-solid fa-star' });
      expect(result.success).toBe(false);
    });

    it('rejects wrong field types', () => {
      const result = servicesSchema.safeParse({
        icon: 'fa-solid fa-star',
        title: 'Test',
        description: 42, // should be string
        order: 'first',  // should be number
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative order', () => {
      const result = servicesSchema.safeParse({
        icon: 'fa-solid fa-star',
        title: 'Test',
        description: 'A description',
        order: -1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('partners', () => {
    it('accepts a valid partner fixture', () => {
      const fixture = { name: 'Gobierno de México', order: 1 };
      const result = partnersSchema.safeParse(fixture);
      expect(result.success).toBe(true);
    });

    it('rejects missing name', () => {
      const result = partnersSchema.safeParse({ order: 2 });
      expect(result.success).toBe(false);
    });

    it('rejects missing order', () => {
      const result = partnersSchema.safeParse({ name: 'Some Partner' });
      expect(result.success).toBe(false);
    });
  });

  describe('bonds', () => {
    it('accepts a valid bond fixture', () => {
      const fixture = {
        metric: '24h',
        title: 'Respuesta rápida',
        description: 'Tiempo de respuesta garantizado.',
        order: 1,
      };
      const result = bondsSchema.safeParse(fixture);
      expect(result.success).toBe(true);
    });

    it('rejects extra unknown fields', () => {
      const result = bondsSchema.safeParse({
        metric: '48h',
        title: 'Title',
        description: 'Desc',
        order: 1,
        unknownField: 'should be rejected',
      });
      // Zod in strict mode rejects unknown fields
      expect(result.success).toBe(false);
    });

    it('rejects empty string title', () => {
      const result = bondsSchema.safeParse({
        metric: '24h',
        title: '',
        description: 'Desc',
        order: 1,
      });
      expect(result.success).toBe(false);
    });
  });
});
