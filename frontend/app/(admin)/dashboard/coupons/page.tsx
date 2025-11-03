import { Metadata } from "next";

import PageTitle from "@/app/(admin)/components/shared/PageTitle";
import Coupons from "./_components";

export const metadata: Metadata = {
  title: "Coupons",
};

export default async function CouponsPage() {
  return (
    <section>
      <PageTitle>Coupons</PageTitle>

      <Coupons />
    </section>
  );
}
