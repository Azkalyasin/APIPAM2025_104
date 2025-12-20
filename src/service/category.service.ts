import { Category } from '@prisma/client';
import prisma from '../config/database';
import { Createcategory, Updatecategory } from '../types/category.type';

export const createCategory = async (data: Createcategory): Promise<Category> => {
  const { name, description } = data;

  return prisma.category.create({
    data: {
      name,
      description,
    },
  });
};

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const updateCategory = async (data: Updatecategory): Promise<Category> => {
  const { id, name, description } = data;

  return prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });
};

export const deleteCategory = async (id: number): Promise<Category> => {
  return prisma.category.delete({
    where: { id },
  });
};
