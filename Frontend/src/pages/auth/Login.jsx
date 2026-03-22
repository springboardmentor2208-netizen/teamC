import React from 'react';
import Header from '../../components/Header/Header';
import LoginForm from '../../components/Header/auth/LoginForm';

function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
