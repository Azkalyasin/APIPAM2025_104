export interface Createcategory {
  name: string;
  description?: string;
}

export interface Updatecategory {
  id: number;
  name?: string;
  description?: string;
}
