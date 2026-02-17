import { Request, Response, NextFunction } from "express";
import {
  getChartDataService,
  getDashboardStatsService,
  getOrderStatusStatsService,
  getCategorySalesDataService,
  getMonthlySalesDataService,
} from "../services/dashboard.js";
import {
  getProductsAdminService,
  toggleProductStatusService,
  deleteProductsService,
  editProductsService,
  exportProductsService,
} from "../services/products.js";
import {
  changeOrderStatusService,
  exportOrdersService,
} from "../services/orders.js";
import {
  getCategoriesAdminService,
  toggleCategoryStatusService,
  editCategoriesService,
  deleteCategoriesService,
  exportCategoriesService,
} from "../services/categories.js";
import {
  toggleCouponStatusService,
  toggleCouponFeaturedService,
  editCouponsService,
  deleteCouponsService,
  exportCouponsService,
} from "../services/coupons.js";
import {
  getAllBrandsService,
  createBrandService,
} from "../services/brands.js";
import {
  editCustomerService,
  deleteCustomerService,
  exportCustomersService,
} from "../services/users.js";
import {
  getReviewsAdminService,
  toggleReviewStatusService,
  deleteReviewAdminService,
  getReviewStatsService,
} from "../services/reviews.js";

// ============ DASHBOARD ============

export const getChartData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getChartDataService({
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getDashboardStatsService({
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrderStatusStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getOrderStatusStatsService({
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCategorySalesData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCategorySalesDataService({
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMonthlySalesData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getMonthlySalesDataService({
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ============ PRODUCTS ADMIN ============

export const getProductsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getProductsAdminService({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      search: req.query.search as string,
      category: req.query.category as string,
      subcategory: req.query.subcategory as string,
      brand: req.query.brand as string,
      active: req.query.active ? req.query.active === "true" : undefined,
      inOffer: req.query.inOffer ? req.query.inOffer === "true" : undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      stockStatus: req.query.stockStatus as
        | "inStock"
        | "lowStock"
        | "outOfStock"
        | undefined,
      minStock: req.query.minStock ? Number(req.query.minStock) : undefined,
      maxStock: req.query.maxStock ? Number(req.query.maxStock) : undefined,
      sortBy: req.query.sortBy as
        | "name"
        | "price"
        | "stock"
        | "created_at"
        | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.id);
    const { active } = req.body;
    await toggleProductStatusService(productId, active);
    res.status(200).json({
      success: true,
      message: "Estado del producto actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productIds } = req.body;
    await deleteProductsService(productIds);
    res.status(200).json({
      success: true,
      message: "Productos eliminados",
    });
  } catch (error) {
    next(error);
  }
};

export const editProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productIds, ...data } = req.body;
    await editProductsService(productIds, data);
    res.status(200).json({
      success: true,
      message: "Productos actualizados",
    });
  } catch (error) {
    next(error);
  }
};

export const exportProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await exportProductsService();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ============ ORDERS ADMIN ============

export const changeOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    await changeOrderStatusService(orderId, status);
    res.status(200).json({
      success: true,
      message: "Estado de orden actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const exportOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await exportOrdersService();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ============ CATEGORIES ADMIN ============

export const getCategoriesAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCategoriesAdminService({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      search: req.query.search as string,
      sortBy: req.query.sortBy as "name" | "created_at" | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      status: req.query.status as "active" | "inactive" | undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleCategoryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { active } = req.body;
    await toggleCategoryStatusService(categoryId, active);
    res.status(200).json({
      success: true,
      message: "Estado de categoría actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const editCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryIds, ...data } = req.body;
    await editCategoriesService(categoryIds, data);
    res.status(200).json({
      success: true,
      message: "Categorías actualizadas",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryIds } = req.body;
    await deleteCategoriesService(categoryIds);
    res.status(200).json({
      success: true,
      message: "Categorías eliminadas",
    });
  } catch (error) {
    next(error);
  }
};

export const exportCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await exportCategoriesService();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// ============ COUPONS ADMIN ============

export const toggleCouponStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = parseInt(req.params.id);
    const { active } = req.body;
    await toggleCouponStatusService(couponId, active);
    res.status(200).json({
      success: true,
      message: "Estado de cupón actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCouponFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = parseInt(req.params.id);
    const { featured } = req.body;
    await toggleCouponFeaturedService(couponId, featured);
    res.status(200).json({
      success: true,
      message: "Estado destacado de cupón actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const editCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { couponIds, ...data } = req.body;
    await editCouponsService(couponIds, data);
    res.status(200).json({
      success: true,
      message: "Cupones actualizados",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { couponIds } = req.body;
    await deleteCouponsService(couponIds);
    res.status(200).json({
      success: true,
      message: "Cupones eliminados",
    });
  } catch (error) {
    next(error);
  }
};

export const exportCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupons = await exportCouponsService();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

// ============ BRANDS ADMIN ============

export const getBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await getAllBrandsService();
    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brand = await createBrandService(req.body);
    res.status(201).json({
      success: true,
      data: brand,
      message: "Marca creada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// ============ CUSTOMERS ADMIN ============

export const editCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = parseInt(req.params.id);
    const customer = await editCustomerService(customerId, req.body);
    res.status(200).json({
      success: true,
      data: customer,
      message: "Cliente actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = parseInt(req.params.id);
    await deleteCustomerService(customerId);
    res.status(200).json({
      success: true,
      message: "Cliente eliminado",
    });
  } catch (error) {
    next(error);
  }
};

export const exportCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await exportCustomersService();
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// ============ REVIEWS ADMIN ============

export const getReviewsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getReviewsAdminService({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      status: req.query.status as "active" | "inactive" | undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      productId: req.query.productId ? Number(req.query.productId) : undefined,
      userId: req.query.userId ? Number(req.query.userId) : undefined,
      search: req.query.search as string,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleReviewStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { active } = req.body;
    await toggleReviewStatusService(reviewId, active);
    res.status(200).json({
      success: true,
      message: "Estado de reseña actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = parseInt(req.params.id);
    await deleteReviewAdminService(reviewId);
    res.status(200).json({
      success: true,
      message: "Reseña eliminada",
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getReviewStatsService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
