/**
 * Sanity GROQ queries
 * All database queries are centralised here for maintainability.
 */
import { groq } from 'next-sanity';

// Fetch all available dishes grouped by category, sorted by category order
export const MENU_QUERY = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    "dishes": *[_type == "dish" && references(^._id) && available == true] | order(name asc) {
      _id,
      name,
      description,
      price,
      "image": image.asset->url,
      "imageAlt": image.alt,
      dietaryTags,
      featured,
      "slug": slug.current
    }
  }
`;

// Fetch a single dish by slug
export const DISH_BY_SLUG_QUERY = groq`
  *[_type == "dish" && slug.current == $slug][0] {
    _id,
    name,
    description,
    price,
    "image": image.asset->url,
    dietaryTags,
    featured
  }
`;