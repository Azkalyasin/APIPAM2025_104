export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name?: string;
  description?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}
