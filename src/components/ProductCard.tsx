import type { Product } from "@/lib/productStore";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  return (
    <div className="relative flex flex-col items-center rounded-lg border border-border bg-card p-3 shadow-sm transition-transform hover:scale-105">
      {discount > 0 && (
        <span className="absolute -right-2 -top-2 z-10 rounded-full bg-promo-badge px-2 py-0.5 text-xs font-bold text-promo-badge-foreground">
          -{discount}%
        </span>
      )}
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <div className="mt-2 flex flex-col items-center gap-0.5 text-center">
        <span className="text-sm font-bold text-price-highlight">
          R$ {product.discountPrice.toFixed(2).replace(".", ",")}
        </span>
        <span className="text-xs text-muted-foreground line-through">
          R$ {product.originalPrice.toFixed(2).replace(".", ",")}
        </span>
        <p className="mt-1 line-clamp-2 text-xs font-medium uppercase text-card-foreground">
          {product.name}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
