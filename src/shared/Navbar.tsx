
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLogoutMutation } from "../features/auth/authApi";
import { toast } from "sonner";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout({ refreshToken }).unwrap();
      }
    } catch {
      // ignore error
    } finally {
      dispatch(clearAuth());
      toast.success("Logged out");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gray-900 text-gray-300 shadow px-6 py-3 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold text-white">
        Test_School
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-lg cursor-pointer select-none"
              aria-label="User menu"
              title={user.email || ""}
            >
              {(user.fullName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              sideOffset={5}
              className="min-w-[160px] rounded-md bg-white p-1 shadow-lg text-gray-800"
            >
              <DropdownMenu.Item
                onSelect={() => navigate("/dashboard/profile")}
                className="px-3 py-2 rounded cursor-pointer hover:bg-gray-200 focus:bg-gray-200 outline-none"
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
              <DropdownMenu.Item
                onSelect={handleLogout}
                className="px-3 py-2 rounded cursor-pointer text-red-600 hover:bg-red-100 focus:bg-red-100 outline-none"
              >
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : (
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
