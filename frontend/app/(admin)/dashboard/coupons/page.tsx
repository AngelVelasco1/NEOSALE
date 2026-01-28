import { Metadata } from "next";

import Coupons from "./_components";
import { RiCouponFill } from "react-icons/ri";

export const metadata: Metadata = {
  title: "Coupons",
};

export default async function CouponsPage() {
  return (
    <section className="space-y-6 p-3 min-h-screen">
      <Coupons />
    </section>
  );
}
