"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { SignOut } from "@/app/(auth)/components/SingOut";


export function UserInfo() {
  const USER = {
    name: "John Smith",
    email: "johnson@nextadmin.com",
    img: "/images/user/user-03.png",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>
          </figcaption>
        </figure>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-w-[280px]"
        align="end"
      >
        <div className="flex items-center gap-2.5 px-4 py-3">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={48}
            height={48}
          />

          <div className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>
            <div className="leading-none text-gray-6">{USER.email}</div>
          </div>
        </div>

        <DropdownMenuSeparator className="border-[#E8E8E8] dark:border-dark-3" />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex w-full items-center gap-2.5 px-4 py-2 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white cursor-pointer"
          >
            <UserIcon />
            <span className="text-base font-medium">View profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/pages/settings"
            className="flex w-full items-center gap-2.5 px-4 py-2 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white cursor-pointer"
          >
            <SettingsIcon />
            <span className="text-base font-medium">Account Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-[#E8E8E8] dark:border-dark-3" />

        <DropdownMenuItem>
              <SignOut />
            <LogOutIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
