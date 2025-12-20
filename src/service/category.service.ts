import prisma from '../config/database';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from '../types/category.type';

export const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
  const { name, description } = data;

  return prisma.category.create({
    data: {
      name,
      description,
    },
  });
};

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id: number): Promise<CategoryResponse | null> => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const updateCategory = async (data: UpdateCategoryRequest): Promise<CategoryResponse> => {
  const { id, name, description } = data;

  return prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });
};

export const deleteCategory = async (id: number): Promise<CategoryResponse> => {
  return prisma.category.delete({
    where: { id },
  });
};
