export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  img_url: string | null;
};

export type ProductVariation = {
  id: number;
  name: string;
  price: number;
  limit: number;
};

export type ProductGroup = {
  id: number;
  name: string;
  description: string | null;
  min: number;
  max: number;
  variations: ProductVariation[];
};

export type ProductDetail = Product & {
  groups: ProductGroup[];
};
