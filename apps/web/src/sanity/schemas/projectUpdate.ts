import { defineField, defineType } from 'sanity';

export const projectUpdate = defineType({
  name: 'projectUpdate',
  title: 'Project Update',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
      description: 'Name of the associated project',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'milestone',
      title: 'Milestone',
      type: 'string',
      description: 'Key milestone this update relates to',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      project: 'projectName',
      date: 'publishedAt',
    },
    prepare({ title, project, date }) {
      return {
        title,
        subtitle: `${project || 'General'} - ${date ? new Date(date).toLocaleDateString() : 'Draft'}`,
      };
    },
  },
});
