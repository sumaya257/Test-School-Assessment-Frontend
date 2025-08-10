import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false); 

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error('Verification token is missing.');
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          setVerified(true);
          toast.success('Email verified successfully!');
          setRedirecting(true);  // রিডাইরেক্ট শুরু হলো
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          const data = await res.json();
          toast.error(data.message || 'Email verification failed.');
          setVerified(false);
        }
      } catch (err) {
        toast.error('Something went wrong during verification.');
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Verifying your email...</p>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-green-600">Email verified! Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {verified ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Email Verified!</h2>
          <p className="mb-6 text-center text-gray-700">
            Your email has been verified successfully. You will be redirected to the dashboard shortly.
          </p>
          <p>
            Or click{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              here
            </Link>{' '}
            to login now.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Verification Failed</h2>
          <p className="mb-6 text-center text-gray-700">
            Unable to verify your email. Please check your verification link or try again later.
          </p>
          <p>
            Return to{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              registration
            </Link>{' '}
            page.
          </p>
        </>
      )}
    </div>
  );
}
