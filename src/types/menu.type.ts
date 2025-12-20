export interface CreateMenuRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  is_available?: boolean;
  image_url?: string;
  stock?: number;
}

export interface UpdateMenuRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  is_available?: boolean;
  image_url?: string;
  stock?: number;
}

export interface MenuFilterRequest {
  categoryId?: number;
  is_available?: boolean;
  search?: string;
}

export interface MenuResponse {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  is_available: boolean;
  stock?: number | null;
  created_at: Date;
  updated_at: Date;

  category: {
    id: number;
    name: string;
  };
}
