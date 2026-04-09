import type { FlyerProduct } from "@/lib/productStore";
import ProductCard from "./ProductCard";
import { ShoppingCart } from "lucide-react";
import storeBg from "@/assets/store-bg.png";

interface FlyerDisplayProps {
  products: FlyerProduct[];
}

const FlyerDisplay = ({ products }: FlyerDisplayProps) => {
  return (
    <div className="flyer-light-lock mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border-4 border-primary shadow-2xl">
      {/* Store background banner */}
      <div className="relative h-48 w-full overflow-hidden sm:h-56">
        <img
          src={storeBg}
          alt="Fachada Super Rede"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary-foreground drop-shadow-md" />
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground drop-shadow-md sm:text-4xl">
              SUPER OFERTAS
            </h1>
          </div>
          <p className="mt-1 text-sm font-semibold text-secondary drop-shadow-sm">
            Super Rede — O barato do seu lado!
          </p>
        </div>
      </div>

      {/* Subheader */}
      <div className="bg-secondary px-4 py-2 text-center">
        <span className="text-sm font-bold text-secondary-foreground">
          Ofertas válidas enquanto durarem os estoques • Imagens ilustrativas
        </span>
      </div>

      {/* Product Grid */}
      <div className="bg-flyer-bg p-4 transition-all duration-500">
        {products.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Nenhum produto cadastrado. Acesse o painel para adicionar ofertas!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-primary px-4 py-3 text-center">
        <p className="text-xs text-primary-foreground">
          Parcele suas compras em até 2x sem juros
        </p>
      </div>
    </div>
  );
};

export default FlyerDisplay;
