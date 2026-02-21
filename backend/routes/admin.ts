import { Router } from "express";
import { authenticateAdmin } from "../middlewares/auth.js";
import {
  getChartData,
  getDashboardStats,
  getOrderStatusStats,
  getCategorySalesData,
  getMonthlySalesData,
  getProductsAdmin,
  toggleProductStatus,
  deleteProducts,
  editProducts,
  exportProducts,
  changeOrderStatus,
  exportOrders,
  getCategoriesAdmin,
  toggleCategoryStatus,
  editCategories,
  deleteCategories,
  exportCategories,
  toggleCouponStatus,
  toggleCouponFeatured,
  editCoupons,
  deleteCoupons,
  exportCoupons,
  getBrands,
  createBrand,
  editCustomer,
  deleteCustomer,
  exportCustomers,
  getReviewsAdmin,
  toggleReviewStatus,
  deleteReview,
  getReviewStats,
} from "../controllers/admin.js";

export const adminRoutes = () =>
  Router()
    // ============ APPLY ADMIN AUTH TO ALL ROUTES ============
    .use(authenticateAdmin)

    // ============ DASHBOARD ============
    .get("/dashboard/chart-data", getChartData)
    .get("/dashboard/stats", getDashboardStats)
    .get("/dashboard/order-status", getOrderStatusStats)
    .get("/dashboard/category-sales", getCategorySalesData)
    .get("/dashboard/monthly-sales", getMonthlySalesData)

    // ============ PRODUCTS ADMIN ============
    .get("/products", getProductsAdmin)
    .patch("/products/:id/status", toggleProductStatus)
    .delete("/products", deleteProducts)
    .put("/products", editProducts)
    .get("/products/export", exportProducts)

    // ============ ORDERS ADMIN ============
    .patch("/orders/:id/status", changeOrderStatus)
    .get("/orders/export", exportOrders)

    // ============ CATEGORIES ADMIN ============
    .get("/categories", getCategoriesAdmin)
    .patch("/categories/:id/status", toggleCategoryStatus)
    .put("/categories", editCategories)
    .delete("/categories", deleteCategories)
    .get("/categories/export", exportCategories)

    // ============ COUPONS ADMIN ============
    .patch("/coupons/:id/status", toggleCouponStatus)
    .patch("/coupons/:id/featured", toggleCouponFeatured)
    .put("/coupons", editCoupons)
    .delete("/coupons", deleteCoupons)
    .get("/coupons/export", exportCoupons)

    // ============ BRANDS ADMIN ============
    .get("/brands", getBrands)
    .post("/brands", createBrand)

    // ============ CUSTOMERS ADMIN ============
    .put("/customers/:id", editCustomer)
    .delete("/customers/:id", deleteCustomer)
    .get("/customers/export", exportCustomers)

    // ============ REVIEWS ADMIN ============
    .get("/reviews", getReviewsAdmin)
    .patch("/reviews/:id/status", toggleReviewStatus)
    .delete("/reviews/:id", deleteReview)
    .get("/reviews/stats", getReviewStats);
