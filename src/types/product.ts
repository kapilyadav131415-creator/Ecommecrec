export interface ProductVariant {
  pV_Id: number;
  pqT_Value: string; // Size/Qty (M, L, XL)
  price: number;
  actualPrice: number;
  stock: number;
}

export interface ProductImage {
  imagE_URL: string;
  isdefault: boolean;
}

export interface Product {
  pD_ID: number;
  pD_NAME: string;
  product_Code: string;
  categoryName: string;
  typeName: string;
  pD_Description: string;
  variants: ProductVariant[];
  images: ProductImage[];
}