import { Metadata } from "next";

import Products from "./_components";
export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  return (
     <section className="min-h-screen">
       <Products />
     </section>
  );
}
