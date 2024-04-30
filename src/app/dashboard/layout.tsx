'use client';
import DashboardLayout from '@/components/Layouts/DashboardLayout';
import Loader from "@/components/common/Loader";
import { Sidebar } from '@/app/ui';
import { Toaster } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { DomainsContext, KeyContext } from "@/app/context";

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

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  const [domains, setDomains] = useState([]);
  const [keys, setKeys] = useState([]);
  const value = useMemo(
    () => ({ domains, setDomains }),
    [domains]
  );
  
  const keyContextValue = useMemo(
    () => ({ keys, setKeys }),
    [keys]
  );

  return (
    <DomainsContext.Provider value={value}>
    <KeyContext.Provider value={keyContextValue}>
    <DashboardLayout>
      <div className='mx-auto lg:max-w-screen-xl px-2.5 lg:px-20'>
        <div className='grid grid-cols-1 lg:gap-5 lg:grid-cols-7'>
          <Sidebar />
          {/* {loading ? <Loader /> : children} */}
            {/* {children} */}

          {children}
          {modal}
        </div>
        <Toaster closeButton />
        </div>

        </DashboardLayout>
        </KeyContext.Provider>
      </DomainsContext.Provider>
  )
}
