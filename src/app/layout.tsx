import { Analytics } from '@vercel/analytics/react';
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { getServerSession } from "next-auth";
import SessionProvider from "@/app/context/SessionProvider";
import { Metadata } from "next";
import { authOptions } from "@/app/lib/authOptions";
import { Footer, Header } from "@/components/templates";

export const metadata: Metadata = {
  title:
    "Wizard AI - Enhance your Web App with AI",
  description: "Wizard AI - Enhance your Web App with AI",
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
        <link id="theme-link" rel="stylesheet" href="/themes/prism-okaidia/theme.min.css" />
        <link rel="icon" href="/favicon.ico" />
        {/* <script src={`./widget.js?client_key=${clientKey}`} ></script> */}
      </head>
      <body suppressHydrationWarning={true}>
        
        <SessionProvider session={session}>
          <Header />
          <div className="dark:bg-boxdark-2 dark:text-bodydark">  
            {/* {loading ? <Loader /> : children} */}
            {children}
          </div>
          <Footer />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
