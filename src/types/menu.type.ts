export interface CreateMenu {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  is_available?: boolean;
  image_url?: string;
  stock?: number;
}

export interface UpdateMenu {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  is_available?: boolean;
  image_url?: string;
  stock?: number;
}

export interface MenuFilter {
  categoryId?: number;
  is_available?: boolean;
  search?: string;
}
