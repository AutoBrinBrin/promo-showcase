export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
}

const STORAGE_KEY = "br-supermercados-products";

const defaultProducts: Product[] = [
  { id: "1", name: "Salgadinho Gula Sticks", originalPrice: 2.49, discountPrice: 1.49, imageUrl: "" },
  { id: "2", name: "Leite Ninho Instantâneo 380g", originalPrice: 19.98, discountPrice: 14.98, imageUrl: "" },
  { id: "3", name: "Mucilon Sachê 180g", originalPrice: 8.99, discountPrice: 5.99, imageUrl: "" },
  { id: "4", name: "Nescau em Pó 370g", originalPrice: 13.98, discountPrice: 9.98, imageUrl: "" },
  { id: "5", name: "Sucrilhos Kelloggs 240g", originalPrice: 10.98, discountPrice: 7.98, imageUrl: "" },
  { id: "6", name: "Pão de Forma Vaibem 450g", originalPrice: 6.49, discountPrice: 4.49, imageUrl: "" },
  { id: "7", name: "Look Itamaraty 55g", originalPrice: 4.98, discountPrice: 2.98, imageUrl: "" },
  { id: "8", name: "Bombom Garoto 250g", originalPrice: 14.98, discountPrice: 10.98, imageUrl: "" },
  { id: "9", name: "Achocolatado Energia 200ml", originalPrice: 1.49, discountPrice: 0.89, imageUrl: "" },
  { id: "10", name: "Arroz Rampinelli 5kg", originalPrice: 32.98, discountPrice: 26.98, imageUrl: "" },
];

export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return defaultProducts;
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, "id">): Product[] {
  const products = getProducts();
  const newProduct: Product = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  saveProducts(products);
  return products;
}

export function removeProduct(id: string): Product[] {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return products;
}

export function removeAllProducts(): Product[] {
  saveProducts([]);
  return [];
}
