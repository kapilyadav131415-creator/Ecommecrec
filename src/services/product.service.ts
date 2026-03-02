import api from './api';
import { Product } from "@/types/product";

export const productService = {
  getFullCatalog: async () => {
    const response = await api.get('/Product/GetFullCatalog');
    return response.data.data as Product[];
  },

  // NEW: Optimized for your .NET filtered endpoints
  getFilteredCatalog: async (params: { mainMenu?: string; category?: string; type?: string }) => {
    // Filter out undefined values to keep the URL clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const response = await api.get('/Product/GetFilteredCatalog', {
      params: cleanParams
    });
    
    return response.data.data as Product[];
  },
  getProductDetails: async (id: string) => {
    const response = await api.get(`/Product/GetDetails/${id}`);
    return response.data.data as Product;
  }
  
};