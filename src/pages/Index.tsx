import { useEffect, useState } from "react";
import { getFlyerItems, getFlyerSettings, type FlyerProduct, type FlyerSettings } from "@/lib/productStore";
import FlyerDisplay from "@/components/FlyerDisplay";
import DarkModeToggle from "@/components/DarkModeToggle";

const Index = () => {
  const [products, setProducts] = useState<FlyerProduct[]>([]);
  const [settings, setSettings] = useState<FlyerSettings | null>(null);

  useEffect(() => {
    getFlyerItems().then(setProducts).catch(() => {});
    getFlyerSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">🛒 Super Rede</h2>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <FlyerDisplay products={products} promoEndDate={settings?.promo_end_date} promoEndTime={settings?.promo_end_time} />
      </main>
    </div>
  );
};

export default Index;
