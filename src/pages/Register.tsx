import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useRegisterMutation } from '../features/auth/authApi';

// Validation schema
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .regex(/^[A-Za-z\s]+$/, 'Full name can contain letters and spaces only')
      .transform((s) => s.trim()),
    email: z.string().email('Please enter a valid email').transform((s) => s.toLowerCase()),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/\d/, 'Password must contain a number')
      .regex(/[@$!%*?&]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [registerApi, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };

      await registerApi(payload).unwrap();

      toast.success('Registration successful. Verification email sent.');

      reset();
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-md shadow p-6 w-full max-w-md border border-gray-200"
        aria-labelledby="register-heading"
      >
        <h2
          id="register-heading"
          className="text-xl font-semibold mb-5 text-gray-800 text-center"
        >
          Create your Test_School account
        </h2>

        {/* Full Name */}
        <label htmlFor="fullName" className="block mb-1 font-medium text-gray-700">
          Full Name
        </label>
        <div className="mb-3">
          <input
            id="fullName"
            {...register('fullName')}
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            className={`w-full border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 text-sm ${
              errors.fullName ? 'border-red-500' : ''
            }`}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-red-600 text-xs mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
          Email
        </label>
        <div className="mb-3">
          <input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p id="email-error" className="text-red-600 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
          Password
        </label>
        <div className="relative mb-3">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={`w-full border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 pr-8 text-sm ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-red-600 text-xs mb-3">
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative mb-4">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className={`w-full border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 pr-8 text-sm ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="text-red-600 text-xs mb-3">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Role note */}
        <p className="text-xs text-gray-500 mb-4">
          Role: <strong>Student</strong> — (Supervisor role is assigned by admin.)
        </p>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`w-full text-sm rounded text-white font-semibold transition ${
            isSubmitting || isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } py-2`}
        >
          {isSubmitting || isLoading ? 'Registering...' : 'Create account'}
        </button>

        <p className="mt-4 text-center text-xs text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
