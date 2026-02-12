import { useState, useEffect } from "react";
import { getCategoriesForNavbar } from "../services/categoriesApi";
import {
  mapCategoriesWithIcons,
  CategoryWithIcon,
} from "../utils/categoryIconMapper";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCategories = await getCategoriesForNavbar();
        // Mapear las categorías con iconos y colores
        const categoriesWithIcons = mapCategoriesWithIcons(fetchedCategories);
        setCategories(categoriesWithIcons);
      } catch (err) {
        
        setError("Error al cargar las categorías");
        // Mantener array vacío para que no rompa la UI
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: () => {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          setError(null);
          const fetchedCategories = await getCategoriesForNavbar();
          const categoriesWithIcons = mapCategoriesWithIcons(fetchedCategories);
          setCategories(categoriesWithIcons);
        } catch (err) {
          
          setError("Error al cargar las categorías");
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    },
  };
};
