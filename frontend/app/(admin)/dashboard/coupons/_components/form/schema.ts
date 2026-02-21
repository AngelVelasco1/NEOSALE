import * as z from "zod";

export const couponFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Coupon name is required" })
      .max(100, "Coupon name must be 100 characters or less"),
    code: z
      .string()
      .min(1, { message: "Coupon code is required" })
      .regex(/^[0-9A-Z]+$/, {
        message: "Code must contain only numbers and capital letters",
      })
      .max(50, "Coupon code must be 50 characters or less"),
    expiresAt: z.coerce.date({
      invalid_type_error: "Expiration date must be a valid date",
    }),
    isPercentageDiscount: z.coerce.boolean(),
    discountValue: z.coerce
      .number({
        invalid_type_error: "Discount value must be a number",
      })
      .min(1, { message: "Discount value must be greater than 0" }),
    minPurchaseAmount: z.coerce
      .number({
        invalid_type_error: "Minimum purchase must be a number",
      })
      .min(0, { message: "Minimum purchase cannot be negative" })
      .optional(),
    usageLimit: z.coerce
      .number({
        invalid_type_error: "Usage limit must be a number",
      })
      .min(1, { message: "Usage limit must be at least 1" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (data.expiresAt < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiration date must be in the future",
        path: ["expiresAt"],
      });
    }

    if (data.isPercentageDiscount && data.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percentage discount cannot be more than 100",
        path: ["discountValue"],
      });
    }
  });

export const couponBulkFormSchema = z.object({
  active: z.coerce.boolean(),
});

export type CouponFormData = z.infer<typeof couponFormSchema>;
export type CouponBulkFormData = z.infer<typeof couponBulkFormSchema>;
