import { Metadata } from "next";

import PageTitle from "@/app/(admin)/components/shared/PageTitle";
import Categories from "./_components";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  return (
    <section>
      <PageTitle>Categories</PageTitle>

      <Categories />
    </section>
  );
}
