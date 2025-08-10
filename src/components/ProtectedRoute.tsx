import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { useRefreshTokenMutation } from "../features/auth/authApi";
import { setToken, setRefreshToken, setUser, clearAuth } from "../features/auth/authSlice";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  const [refreshTokenApi] = useRefreshTokenMutation();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!accessToken && refreshToken) {
        try {
          const res = await refreshTokenApi({ refreshToken }).unwrap();
          dispatch(setToken(res.accessToken));
          dispatch(setRefreshToken(res.refreshToken));
          dispatch(setUser(res.user));
        } catch (err) {
          console.error("Refresh token failed:", err);
          dispatch(clearAuth());
        }
      }
      setChecking(false);
    };

    verifyAuth();
  }, [accessToken, refreshToken, refreshTokenApi, dispatch]);

  if (checking) {
    return <div>Checking authentication...</div>;
  }

  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
