// Dish schema — the core menu item document
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'dish',
  title: 'Dish',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Dish Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'price',
      title: 'Price (£)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Dish Image',
      type: 'image',
      options: { hotspot: true }, // Allows cropping in Sanity Studio
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Uncheck to hide this dish from the menu without deleting it',
      initialValue: true,
    }),
    defineField({
      name: 'dietaryTags',
      title: 'Dietary Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Vegetarian', value: 'vegetarian' },
          { title: 'Vegan', value: 'vegan' },
          { title: 'Gluten Free', value: 'gluten-free' },
          { title: 'Halal', value: 'halal' },
          { title: 'Contains Nuts', value: 'nuts' },
          { title: 'Spicy', value: 'spicy' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: "Chef's Special",
      type: 'boolean',
      description: "Mark as Chef's Special to highlight on the menu",
      initialValue: false,
    }),
  ],
  // Preview configuration for Sanity Studio list view
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title',
      media: 'image',
    },
  },
});
