import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, type Product } from "@/lib/productStore";
import FlyerDisplay from "@/components/FlyerDisplay";
import DarkModeToggle from "@/components/DarkModeToggle";
import storeBg from "@/assets/store-bg.png";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundImage: `url(${storeBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Vignette overlay */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.85)' }} />
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">🛒 Super Rede</h2>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <Settings className="mr-1 h-4 w-4" />
                Painel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <FlyerDisplay products={products} />
      </main>
    </div>
  );
};

export default Index;
