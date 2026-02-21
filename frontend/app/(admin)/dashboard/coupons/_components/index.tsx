"use client";

import { useState, Fragment } from "react";

import AllCoupons from "./coupons-table";
import CouponActions from "./CouponActions";
import CouponFilters from "./CouponFilters";

export default function Products() {
  const [rowSelection, setRowSelection] = useState({});

  return (
    <Fragment>
      <CouponFilters />
      <CouponActions
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      <AllCoupons
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </Fragment>
  );
}
