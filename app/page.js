"use client"
import Navbar from '../components/Navbar';
import { db } from '../components/firebase.jsx';
import ReportsPage from '../components/ReportsPage';
import DailyWeekendTrends from '../components/DailyWeekendTrends';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import Overview from '@/components/Overview';

import Menu from '@/components/Menu';



export default function Home() {
  return (
    <main>
      <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
      <Navbar />
      <div className="flex flex-col items-center justify-between pt-24">
        <div className="text-right font-bold text-2xl opacity-50 mt-8 font-mono">
          <h1>Analytics Overview</h1>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-8">
        {/* First Column */}
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 text-center">
          <Overview />
        </div>

        {/* Second Column */}
        <div className="w-full md:w-1/2 lg:w-2/3 xl:w-3/4 p-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-2">
              <DailyWeekendTrends />
            </div>
            <div className="w-full md:w-1/2 p-2">
              <SentimentAnalysis />
            </div>
            <div className="w-full md:w-1/2 p-2">
          <Menu />
        </div>

          </div> 
        </div>
      </div>
    </main>
  );
}
