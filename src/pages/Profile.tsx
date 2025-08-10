
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../features/auth/authApi";
import { toast } from "sonner";
import { useAppSelector } from "../hooks";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";


interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [resetPassword] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token: "", newPassword: data.newPassword }).unwrap();
      toast.success("Password reset successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
        <h1 className="text-3xl font-semibold mb-6 text-center">Profile</h1>

        {/* User Info */}
        {user ? (
          <div className="mb-8">
            <p>
              <span className="font-semibold">Name: </span> {user.fullName}
            </p>
            <p>
              <span className="font-semibold">Email: </span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Role: </span> {user.role}
            </p>
          </div>
        ) : (
          <p className="text-center text-red-500">No user data found.</p>
        )}

        {/* Password Reset Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="newPassword" className="block mb-1 font-medium">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className={`w-full px-3 py-2 border rounded ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum length is 6" },
                })}
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-3 py-2 border rounded ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
