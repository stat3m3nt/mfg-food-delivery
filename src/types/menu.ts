/**
 * TypeScript types for Sanity menu data
 */

export interface Dish {
    _id: string;
    name: string;
    description: string;
    price: number; // in pounds (from Sanity)
    image: string;
    imageAlt?: string;
    dietaryTags?: string[];
    featured?: boolean;
    slug: string;
  }
  
  export interface MenuCategory {
    _id: string;
    title: string;
    slug: string;
    dishes: Dish[];
  }