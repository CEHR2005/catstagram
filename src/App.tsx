import "../app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ImageGallery } from "@/components/ui/Gallery.tsx";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Route, Routes } from "react-router-dom";
import { Link } from "@radix-ui/react-navigation-menu";
import Post from "@/components/Post";
import { Login } from "@/components/Login.tsx";
import { Register } from "@/components/Register.tsx";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = Cookies.get("user");
    console.log(user);
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    setIsLoggedIn(false);
  };
  return (
    <>
      <header className="flex items-center justify-between p-6 max-w">
        <NavigationMenu className="border-black border rounded">
          <NavigationMenuList className="">
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Posts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/post">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Post
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList className="ml-auto">
            {!isLoggedIn ? (
              <>
                <NavigationMenuItem>
                  <Link href="/login">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Login
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/register">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Register
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            ) : (
              <NavigationMenuItem>
                <button
                  onClick={handleLogout}
                  className={navigationMenuTriggerStyle()}
                >
                  Logout
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <body className="justify-center px-5 content-center ">
        <Routes>
          <Route path="/" element={<ImageGallery />}></Route>
          <Route path="/post" element={<Post />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Toaster />
      </body>
    </>
  );
}

export default App;
