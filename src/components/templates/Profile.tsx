"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { useState } from "react";
// import { UserDeleteDialog } from "@/app/ui";
// import { ProfileDelete } from "@/components/templates";

export default function Profile() {
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const {data: session, status} = useSession();
  const router = useRouter();

  const handleSignin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signIn();
  }

  const handleSignout = (e) => {
    e.preventDefault();
    signOut();
  }

  // Loading state
  if (status === "loading") return <Skeleton width={100} />;

  // Signed out state
  if ( !session || !session.user ) {
    return (
      <a href="/signin" onClick={handleSignin} className="flex gap-2 items-center px-4 py-2 rounded-md hover:bg-gray-100">
        Signin
        <svg
          className="w-7 h-7 rounded-full"
          fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </a>
    );
  }

  // Signed in state
  const { user } = session;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex gap-2 items-center px-4 py-2 rounded-md hover:bg-gray">
        {user.name?? user.email}
        <Image className="w-7 h-7 rounded-full" src={
          user.image ||
          `https://avatars.dicebear.com/api/micah/${session?.user?.name}.svg`
        } alt='Profile' width={34} height={34} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-60 p-4 animate-fade-in rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-2 pt-0 text-sm text-gray-700">
          <b className="block font-bold">{user.name || ''}</b>
          <div className="text-gray-500">{user.email}</div>
        </div>
        <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray"
          onSelect={() => router.push('/dashboard')}>
          Dashboard
        </DropdownMenu.Item>
        <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray"
          onSelect={() => router.push('/dashboard/profile')}>
          Update Profile
        </DropdownMenu.Item>
        {/* <UserDeleteDialog id={user.id} open={deleteDialogOpen} setOpen={setDeleteDialogOpen} trigger={(
          <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray"
            onSelect={(e) => { e.preventDefault(); setDeleteDialogOpen(true) }}>
            Delete Account
          </DropdownMenu.Item>          
        )} /> */}

        <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray"
          onSelect={(e) => handleSignout(e)}>
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
