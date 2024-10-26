import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Signin() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      setError("");
      setLoading(true);
      await signin(email.value, password.value);
      navigate("/pomo");
    } catch (error) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center">
            <span className="text-3xl font-bold text-red-600">🍅 Pomodoro</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          {error && (
            <div className="mt-2 text-center text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700" 
                  htmlFor="email"
                >
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700" 
                  htmlFor="password"
                >
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    ログイン状態を保持
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="#" className="font-medium text-red-600 hover:text-red-500">
                    パスワードを忘れた方
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? "ログイン中..." : "ログイン"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <Link 
                  to="/signup" 
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  アカウントをお持ちでない方はこちら
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;