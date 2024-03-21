import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { getServerSession } from "next-auth";
import SessionProvider from "@/app/context/SessionProvider";
import { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Footer, Header } from "@/components/templates";

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
  const session = await getServerSession(authOptions);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(false);

  // const pathname = usePathname();

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <Header />
          <div className="dark:bg-boxdark-2 dark:text-bodydark">  
            {/* {loading ? <Loader /> : children} */}
            {children}
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
