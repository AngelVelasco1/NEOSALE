import { Metadata } from "next";

import Categories from "./_components";
import { BiSolidPurchaseTag } from "react-icons/bi";
export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  return (
   <section className="space-y-6 p-3 min-h-screen">
      
       <Categories />
     </section>
  );
}
