'use client';
import DashboardLayout from '@/components/Layouts/DefaultLayout';
import Loader from "@/components/common/Loader";
import { Sidebar } from '@/app/ui';
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  }) {
    // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  
  return (
    <DashboardLayout>
      
      <div className='mx-auto lg:max-w-screen-xl px-2.5 lg:px-20'>
        <div className='grid grid-cols-1 lg:gap-5 lg:grid-cols-7'>
          <Sidebar />
          {loading ? <Loader /> : children}
          {/* {children} */}
          {modal}
        </div>
        <Toaster closeButton />
        </div>
    </DashboardLayout>
  )
}