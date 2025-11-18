import { Metadata } from "next";
import { redirect } from "next/navigation";

import PageTitle from "@/app/(admin)/components/shared/PageTitle";
import EditProfileForm from "./_components/EditProfileForm";
import { fetchStaffDetails } from "@/app/(admin)/services/staff";
import { auth } from "@/app/(auth)/auth";

export const metadata: Metadata = {
  title: "Edit Profile",
};

export default async function EditProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await fetchStaffDetails(parseInt(session.user.id));

  if (!profile) {
    redirect("/login");
  }

  return (
    <section>
      <PageTitle>Edit Profile</PageTitle>

      <EditProfileForm profile={profile} />
    </section>
  );
}
