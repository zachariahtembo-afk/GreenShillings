import { defineField, defineType } from 'sanity';

export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name (e.g., "shield", "leaf", "globe")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  orderings: [
    {
      title: 'Priority',
      name: 'priorityAsc',
      by: [{ field: 'priority', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      priority: 'priority',
    },
    prepare({ title, priority }) {
      return {
        title,
        subtitle: `Priority: ${priority}`,
      };
    },
  },
});
