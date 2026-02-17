"use server";

import { revalidatePath } from "next/cache";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "@/lib/cloudinary";
import { apiClient } from "@/lib/api-client";
import { requireAuth } from "@/lib/auth-helpers";
import { profileFormSchema } from "@/app/(admin)/dashboard/edit-profile/_components/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { ProfileServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProfile(
  userId: string,
  formData: FormData
): Promise<ProfileServerActionResponse> {
  // Validate auth
  await requireAuth("user", "admin");

  // Validate form data
  const parsedData = profileFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    image: formData.get("image"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...profileData } = parsedData.data;

  try {
    let imageUrl: string | undefined = undefined;

    // Upload image to Cloudinary if provided
    if (image instanceof File && image.size > 0) {
      try {
        imageUrl = await uploadImageToCloudinary(
          image,
          "neosale/profiles",
          "profile" // Preset: 400x400, quality 80, WebP
        );
      } catch (uploadError) {
        console.error("[editProfile] Image upload failed:", uploadError);
        return {
          success: false,
          error:
            "Failed to upload profile picture. Please try again or use a different image.",
        };
      }
    }

    // Call backend endpoint to update profile
    const response = await apiClient.put(`/users/profile/edit`, {
      name: profileData.name,
      phone: profileData.phone || undefined,
      image: imageUrl,
      currentPassword: profileData.currentPassword || undefined,
      newPassword: profileData.newPassword || undefined,
    });

    if (!response.ok) {
      // Handle validation errors from backend
      if (response.data?.validationErrors) {
        return { validationErrors: response.data.validationErrors };
      }
      return {
        success: false,
        error: response.data?.error || "Failed to update profile",
      };
    }

    revalidatePath("/dashboard/edit-profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[editProfile] Error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
      success: false,
      error:
        "Something went wrong while updating your profile. Please try again later.",
    };
  }
}
