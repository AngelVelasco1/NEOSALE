import { Metadata } from "next";

import Products from "./_components";
import { AiFillProduct } from "react-icons/ai";
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
