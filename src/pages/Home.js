// Home.js
import { Link } from "react-router-dom";

function Home() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="text-red-600"> KINOKEN </span>
             Is All You Need.
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
            Take control of your time using the Pomodoro Technique.
            Break your work into focused intervals and achieve more.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/pomo"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10"
              >
                タイマーを開始
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-red-600 text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 md:py-4 md:text-lg md:px-10"
              >
                統計を見る
              </Link>
            </div>
          </div>
        </div>
  
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
              <div className="space-y-4">
                <div className="text-red-600 text-2xl">⏱️</div>
                <h3 className="text-lg font-semibold text-gray-900">集中タイマー</h3>
                <p className="text-gray-600">
                  25分の作業セッションと5分の休憩で、効率的に作業を進めましょう
                </p>
              </div>
            </div>
          </div>
  
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
              <div className="space-y-4">
                <div className="text-red-600 text-2xl">📊</div>
                <h3 className="text-lg font-semibold text-gray-900">進捗管理</h3>
                <p className="text-gray-600">
                  カテゴリー別の統計で、自分の作業時間を可視化できます
                </p>
              </div>
            </div>
          </div>
  
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
              <div className="space-y-4">
                <div className="text-red-600 text-2xl">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900">目標達成</h3>
                <p className="text-gray-600">
                  タスクを細分化して、着実に目標を達成しましょう
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;