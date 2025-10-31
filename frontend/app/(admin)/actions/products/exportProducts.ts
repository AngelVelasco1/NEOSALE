"use server";

// TODO: Migrar a Prisma
// import { createServerActionClient } from "@/lib/supabase/server-action";

export async function exportProducts() {
  // TODO: Implementar con Prisma
  return { error: "Export products not implemented yet. Migration to Prisma pending." };
  
  /* CÓDIGO ORIGINAL CON SUPABASE - PENDIENTE DE MIGRACIÓN
  const supabase = createServerActionClient();

  const selectQuery = `
    *,
    categories(name)
  `;

  const { data, error } = await supabase.from("products").select(selectQuery);

  if (error) {
    console.error(`Error fetching products:`, error);
    return { error: `Failed to fetch data for products.` };
  }

  return { data };
  */
}
