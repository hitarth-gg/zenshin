import { Theme } from "@radix-ui/themes";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";
import { Toaster } from "sonner";
import { useState } from "react";
import Header from "../components/Header";

export default function AppLayout({ props }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [theme, setTheme] = useState("dark");

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    console.log(theme);
  }

  return (
    <Theme appearance={theme}>
      {/* <div className="pointer-events-none h-0 w-0 opacity-0"></div> */}
      {/* <Toaster
        theme={theme}
        toastOptions={{
          classNames: {
            error:
              theme === "dark"
                ? "bg-[#1c1317] border border-rose-500"
                : "bg-red-100 border border-rose-500",
            title: theme === "dark" ? "text-rose-500" : "text-red-600",
            description: theme === "dark" ? "text-rose-200" : "text-red-600",
            actionButton: "bg-zinc-400",
            cancelButton: "bg-orange-400",
            closeButton: "bg-lime-400",
            icon: "text-rose-100",
          },
        }}
      /> */}
      <Toaster
        theme={theme}
        // richColors
        unstyled={false}
        toastOptions={{
          classNames: {
            error: "bg-[#1c1317] border border-rose-500",
            success: "bg-[#131c16] border border-green-500",
            icon: "opacity-80",
            description: "font-space-mono text-white opacity-90",
          },
        }}
      />
        <div className="layout flex flex-col font-inter">
          {isLoading && <Loader />}
          <Header />
          <main className="">{props || <Outlet />}</main>
        </div>
    </Theme>
  );
}
