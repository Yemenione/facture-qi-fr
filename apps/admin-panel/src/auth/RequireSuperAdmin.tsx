import { Navigate, Outlet } from "react-router-dom";
import { CommandPalette } from "../components/CommandPalette";

export const RequireSuperAdmin = () => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <CommandPalette />
            <Outlet />
        </>
    );
};
