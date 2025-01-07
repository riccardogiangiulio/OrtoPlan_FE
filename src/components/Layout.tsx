import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const Layout = () => {
    const location = useLocation();
    const excludedPaths = ["/", "/login", "/register"];
    const shouldShowNavbar = !excludedPaths.includes(location.pathname);

    return (
        <div className="relative min-h-screen pb-[400px]">
            {shouldShowNavbar && <Navbar />}
            <main>
                <Outlet />
            </main>
            <Footer className="absolute bottom-0 left-0 right-0" />
        </div>
    );
};

export default Layout;
