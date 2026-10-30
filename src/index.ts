import { itemCount, total, type LineItem } from "./cart";
import { formatCents } from "./format";

export * from "./cart";
export * from "./format";

export function receipt(items: LineItem[], couponCode?: string): string {
  const count = itemCount(items);
  return `${count} ${count === 1 ? "item" : "items"}, total ${formatCents(total(items, couponCode))}`;
}

if (import.meta.main) {
  const demo: LineItem[] = [
    { sku: "mug", name: "Factory mug", priceCents: 1800, quantity: 2 },
    { sku: "sticker", name: "Rocket sticker", priceCents: 350, quantity: 1 },
  ];
  console.log(receipt(demo, process.argv[2]));
}
