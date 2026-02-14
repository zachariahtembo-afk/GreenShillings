import { defineField, defineType } from 'sanity';

export const advocacyContent = defineType({
  name: 'advocacyContent',
  title: 'Advocacy Content',
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
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Policy Briefing', value: 'briefing' },
          { title: 'Research Paper', value: 'paper' },
          { title: 'Market Analysis', value: 'analysis' },
          { title: 'Community Report', value: 'report' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: {
        list: [
          { title: 'Information Asymmetry', value: 'information-asymmetry' },
          { title: 'Carbon Finance Flows', value: 'carbon-finance' },
          { title: 'Community Rights', value: 'community-rights' },
          { title: 'Standards & Integrity', value: 'standards' },
          { title: 'Policy Reform', value: 'policy' },
        ],
      },
    }),
    defineField({
      name: 'audience',
      title: 'Target Audience',
      type: 'string',
      options: {
        list: [
          { title: 'Policymakers', value: 'policymakers' },
          { title: 'Communities', value: 'communities' },
          { title: 'Partners & Investors', value: 'partners' },
          { title: 'General Public', value: 'public' },
        ],
      },
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
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'documentUrl',
      title: 'Document URL',
      type: 'url',
      description: 'Link to downloadable PDF or document',
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
      contentType: 'contentType',
      date: 'publishedAt',
    },
    prepare({ title, contentType, date }) {
      return {
        title,
        subtitle: `${contentType || 'Unknown'} - ${date ? new Date(date).toLocaleDateString() : 'Draft'}`,
      };
    },
  },
});
