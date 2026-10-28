import { BASE_PATH } from "@/lib/site";

/**
 * A product's logo: the rendered PNG in public/products/<id>.png — a lit tile in the product colour carrying its
 * mark, drawn in the ZINTRAZ wordmark's style. The image includes its own soft shadow, so the visible tile is about
 * 78% of `size`. A plain <img> (static export, no image optimiser), so the base path is prefixed here.
 */
export default function ProductLogo({ id, name, size = 96, className }: { id: string; name?: string; size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE_PATH}/products/${id}.png`}
      alt={name ? `${name} logo` : ""}
      width={size}
      height={size}
      className={className}
      draggable={false}
      decoding="async"
    />
  );
}
