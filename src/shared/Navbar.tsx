import { Link } from "react-router-dom";
import { clearAuth } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLogoutMutation } from "../features/auth/authApi";
import { toast } from "sonner";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const user = useAppSelector((state) => state.auth.user); // add user selector
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
      toast.success('Logged out');
    }
  };

  return (
    <nav className="bg-gray-900 text-gray-300 shadow px-6 py-3 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold text-white">
        Test_School
      </Link>

      <div className="flex items-center gap-4">
        {user && (
          <div className="relative flex flex-col items-center cursor-default select-none w-10 h-10">
            <div
              className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg"
              title={user.email || ""}
            >
              {(user.fullName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>

            <span
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-indigo-700 text-xs font-semibold whitespace-nowrap select-none"
              style={{ lineHeight: '1' }}
            >
              {user.fullName || user.email || "User"}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
