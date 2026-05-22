/**
 * Helper to build optimised Sanity image URLs with transformations
 */
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}