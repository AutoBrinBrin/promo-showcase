import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  addProduct,
  removeProduct,
  removeAllProducts,
  type Product,
} from "@/lib/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImagePlus, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!name || !originalPrice || !discountPrice) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const op = parseFloat(originalPrice.replace(",", "."));
    const dp = parseFloat(discountPrice.replace(",", "."));
    if (isNaN(op) || isNaN(dp) || op <= 0 || dp <= 0) {
      toast.error("Preços inválidos.");
      return;
    }
    const updated = addProduct({
      name,
      originalPrice: op,
      discountPrice: dp,
      imageUrl: imagePreview,
    });
    setProducts(updated);
    setName("");
    setOriginalPrice("");
    setDiscountPrice("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Produto adicionado!");
  };

  const handleRemove = (id: string) => {
    setProducts(removeProduct(id));
    toast.success("Produto removido.");
  };

  const handleRemoveAll = () => {
    setProducts(removeAllProducts());
    toast.success("Todos os produtos foram removidos.");
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
          <Button variant="destructive" size="sm" onClick={handleRemoveAll}>
            <Trash2 className="mr-1 h-4 w-4" />
            Limpar tudo
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Add form */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-card-foreground">Adicionar Produto</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do produto</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Arroz Tipo 1 5kg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Foto do produto</Label>
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
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-10 w-10 rounded object-cover" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
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
          <Button className="mt-4" onClick={handleAdd}>
            Adicionar ao Folheto
          </Button>
        </section>

        {/* Products list */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Produtos cadastrados ({products.length})
          </h3>
          {products.length === 0 ? (
            <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
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
                      </span>{" "}
                      →{" "}
                      <span className="font-bold text-price-highlight">
                        R$ {p.discountPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleRemove(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
