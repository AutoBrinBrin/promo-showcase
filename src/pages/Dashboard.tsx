import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getPresets,
  createPreset,
  deletePreset,
  getFlyerItems,
  addFlyerItem,
  removeFlyerItem,
  removeAllFlyerItems,
  getFlyerSettings,
  updateFlyerSettings,
  type ProductPreset,
  type FlyerProduct,
  type FlyerSettings,
} from "@/lib/productStore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ImagePlus,
  LogOut,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [presets, setPresets] = useState<ProductPreset[]>([]);
  const [flyerItems, setFlyerItems] = useState<FlyerProduct[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  // New preset form
  const [showNewPreset, setShowNewPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetFile, setNewPresetFile] = useState<File | null>(null);
  const [newPresetPreview, setNewPresetPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  // Promo settings
  const [promoDate, setPromoDate] = useState("");
  const [promoTime, setPromoTime] = useState("");
  const [showTime, setShowTime] = useState(false);

  const loadData = async () => {
    try {
      const [p, f, s] = await Promise.all([getPresets(), getFlyerItems(), getFlyerSettings()]);
      setPresets(p);
      setFlyerItems(f);
      setPromoDate(s.promo_end_date ?? "");
      setPromoTime(s.promo_end_time?.slice(0, 5) ?? "");
      setShowTime(!!s.promo_end_time);
    } catch {
      toast.error("Erro ao carregar dados.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToFlyer = async () => {
    if (!selectedPreset || !originalPrice || !discountPrice) {
      toast.error("Selecione um produto e preencha os preços.");
      return;
    }
    const op = parseFloat(originalPrice.replace(",", "."));
    const dp = parseFloat(discountPrice.replace(",", "."));
    if (isNaN(op) || isNaN(dp) || op <= 0 || dp <= 0) {
      toast.error("Preços inválidos.");
      return;
    }
    setLoading(true);
    try {
      await addFlyerItem(selectedPreset, op, dp);
      await loadData();
      setSelectedPreset("");
      setOriginalPrice("");
      setDiscountPrice("");
      toast.success("Produto adicionado ao folheto!");
    } catch {
      toast.error("Erro ao adicionar.");
    }
    setLoading(false);
  };

  const handleCreatePreset = async () => {
    if (!newPresetName.trim()) {
      toast.error("Informe o nome do produto.");
      return;
    }
    setLoading(true);
    try {
      await createPreset(newPresetName.trim(), newPresetFile ?? undefined);
      await loadData();
      setNewPresetName("");
      setNewPresetFile(null);
      setNewPresetPreview("");
      setShowNewPreset(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Produto criado!");
    } catch {
      toast.error("Erro ao criar produto.");
    }
    setLoading(false);
  };

  const handleDeletePreset = async (id: string) => {
    try {
      await deletePreset(id);
      await loadData();
      toast.success("Produto removido dos presets.");
    } catch {
      toast.error("Erro ao remover. Pode estar em uso no folheto.");
    }
  };

  const handleRemoveFlyer = async (id: string) => {
    try {
      await removeFlyerItem(id);
      await loadData();
      toast.success("Item removido do folheto.");
    } catch {
      toast.error("Erro ao remover.");
    }
  };

  const handleRemoveAll = async () => {
    try {
      await removeAllFlyerItems();
      await loadData();
      toast.success("Folheto limpo.");
    } catch {
      toast.error("Erro ao limpar.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPresetFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setNewPresetPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h2 className="text-lg font-bold text-foreground">Painel de Ofertas</h2>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleRemoveAll}>
              <Trash2 className="mr-1 h-4 w-4" />
              Limpar folheto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
                toast.success("Logout realizado.");
              }}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Add to flyer */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-card-foreground">
            Adicionar ao Folheto
          </h3>

          {/* Preset selector as grid */}
          <Label className="mb-2 block">Selecione o produto</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 mb-4 max-h-60 overflow-y-auto rounded-lg border border-border p-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all text-center ${
                  selectedPreset === p.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-contain" />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight text-card-foreground line-clamp-2">
                  {p.name}
                </span>
              </button>
            ))}
            {/* Button to create new preset */}
            <button
              onClick={() => setShowNewPreset(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/30 p-2 transition-all hover:border-primary hover:bg-primary/5"
            >
              <div className="flex h-14 w-14 items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">Novo produto</span>
            </button>
          </div>

          {/* Prices */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="original">Preço Original (R$)</Label>
              <Input
                id="original"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Ex: 29,90"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Preço com Desconto (R$)</Label>
              <Input
                id="discount"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Ex: 19,90"
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddToFlyer} disabled={loading}>
            Adicionar ao Folheto
          </Button>
        </section>

        {/* New preset dialog */}
        {showNewPreset && (
          <section className="rounded-xl border border-primary bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-card-foreground">Criar Novo Produto</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowNewPreset(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome do produto</Label>
                <Input
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Ex: Arroz Tipo 1 5kg"
                />
              </div>
              <div className="space-y-2">
                <Label>Foto do produto</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-1 h-4 w-4" />
                    Escolher imagem
                  </Button>
                  {newPresetPreview && (
                    <img src={newPresetPreview} alt="Preview" className="h-10 w-10 rounded object-cover" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleCreatePreset} disabled={loading}>
              Criar Produto
            </Button>
          </section>
        )}

        {/* Flyer items */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Itens no Folheto ({flyerItems.length})
          </h3>
          {flyerItems.length === 0 ? (
            <p className="text-muted-foreground">Nenhum item no folheto.</p>
          ) : (
            <div className="space-y-2">
              {flyerItems.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-card-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="line-through">
                        R$ {p.originalPrice.toFixed(2).replace(".", ",")}
                      </span>{" "}→{" "}
                      <span className="font-bold text-price-highlight">
                        R$ {p.discountPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveFlyer(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Presets management */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Produtos Cadastrados ({presets.length})
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {presets.map((p) => (
              <div key={p.id} className="relative flex flex-col items-center rounded-lg border border-border bg-card p-3">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -right-1 -top-1 h-6 w-6"
                  onClick={() => handleDeletePreset(p.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-contain" />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <span className="mt-1 text-xs font-medium text-card-foreground text-center line-clamp-2">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
