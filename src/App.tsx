import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import './index.css';

interface AdminStatus {
  isAdmin: boolean;
  roles?: string[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({ isAdmin: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const adminInfo = await checkAdminStatus(user.uid);
        setAdminStatus(adminInfo);
      } else {
        setUser(null);
        setAdminStatus({ isAdmin: false });
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]); // Added navigate to dependency array

  const checkAdminStatus = async (uid: string): Promise<AdminStatus> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return {
          isAdmin: userDoc.data().isAdmin || false,
          roles: userDoc.data().roles || []
        };
      }
      return { isAdmin: false };
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
         <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Landing />
              )
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <AuthGuard user={user}>
                <Dashboard 
                  adminStatus={adminStatus}
                  setAdminStatus={setAdminStatus}
                />
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
 
    </ErrorBoundary>
  );
}

const AuthGuard = ({ user, children }: { user: User | null; children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};

export default App;