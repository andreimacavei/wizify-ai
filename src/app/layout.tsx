import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import NavMenu from "@/components/NavMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Mage AI - Enhance your Web App with AI",
  description: "Mage AI - Enhance your Web App with AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(false);

  // const pathname = usePathname();

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
      <SessionProvider session={session}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">  
            {/* {loading ? <Loader /> : children} */}
            <NavMenu />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
