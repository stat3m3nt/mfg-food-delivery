/**
 * DietaryBadge
 * Small colour-coded pill showing a dietary attribute on a dish card.
 */

const BADGE_CONFIG: Record<string, { label: string; className: string }> = {
    vegetarian: { label: '🌿 Vegetarian', className: 'bg-green-100 text-green-800' },
    vegan: { label: '🌱 Vegan', className: 'bg-emerald-100 text-emerald-800' },
    'gluten-free': { label: '🌾 GF', className: 'bg-yellow-100 text-yellow-800' },
    halal: { label: '☪ Halal', className: 'bg-blue-100 text-blue-800' },
    nuts: { label: '🥜 Contains Nuts', className: 'bg-amber-100 text-amber-800' },
    spicy: { label: '🌶 Spicy', className: 'bg-red-100 text-red-800' },
  };
  
  export default function DietaryBadge({ tag }: { tag: string }) {
    const config = BADGE_CONFIG[tag];
    if (!config) return null;
  
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  }