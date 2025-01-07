import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";

const Layout = () => {
    const location = useLocation();
    const excludedPaths = ["/", "/login", "/register"];
    const shouldShowNavbar = !excludedPaths.includes(location.pathname);

    return (
        <div>
            {shouldShowNavbar && <Navbar />}
            <Outlet />
        </div>
    );
};

export default Layout;
