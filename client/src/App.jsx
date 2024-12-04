import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import VisitsByHourLineChart from "./components/VisitsByHourLineChart";
import siteData from "./lib/siteData";

const apiURL = siteData.apiURL;
const siteName = siteData.siteName;
const cleanedSiteName = siteName.replace(/^https?:\/\/(?:www\.)?/, "");

function App() {
  const [data, setData] = useState({
    uniqueIps: 0,
    totalViews: 0,
    visitsLast24Hours: 0,
    visitsByDay: {},
    visitsByHour: {},
    deviceCounts: {},
    browserCounts: {},
    osCounts: {},
    countryCounts: {},
  });

  const [analyticsData, setAnalyticsData] = useState({ visitsByHour: {} });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(apiURL);
        const jsonData = await response.json();
        setAnalyticsData(jsonData);
        setData(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <main className="text-sm">
      <div className="mt-4">
        <p>
          <span className="text-green-500 font-black">{"/// "}</span>
          analytics{" "}
          <span className="bg-green-900 px-4 rounded-lg">
            <a href={siteName} target="blank">
              {cleanedSiteName}
            </a>
          </span>
        </p>
      </div>

      <div className="mt-8 gap-2 grid grid-cols-3 mx-2">
        <div className="flex justify-between gap-8 border px-2 py-1 items-center rounded-md border-green-400">
          <p>Unique Visits</p>
          <div className="text-green-400">{data.uniqueIps}</div>
        </div>
        <div className="flex justify-between gap-8 border px-2 py-1 items-center rounded-md border-green-400">
          <p>Total Views</p>
          <div className="text-green-400">{data.totalViews}</div>
        </div>
        <div className="flex justify-between gap-8 border px-2 py-1 items-center rounded-md border-green-400">
          <p>Visits | 24 Hours</p>
          <div className="text-green-400">{data.visitsLast24Hours}</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 -mx-2">
        {/* Devices */}
        <div className=" p-4 rounded-lg">
          <p className="bg-green-800 text-white rounded-lg px-2 py-1 items-center">
            Devices
          </p>
          <ul className="mt-2 mx-2">
            {Object.entries(data.deviceCounts).map(([device, count]) => (
              <li key={device} className="flex justify-between">
                {device} <span className="text-green-400">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Browsers */}
        <div className=" p-4 rounded-lg">
          <p className="bg-green-800 text-white rounded-lg px-2 py-1 items-center">
            Browsers
          </p>
          <ul className="mt-2 mx-2">
            {Object.entries(data.browserCounts).map(([browser, count]) => (
              <li key={browser} className="flex justify-between">
                {browser} <span className="text-green-400">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Operating Systems */}
        <div className="p-4 rounded-lg">
          <p className="bg-green-800 text-white rounded-lg px-2 py-1 items-center">
            Operating Systems
          </p>
          <ul className="mt-2 mx-2">
            {Object.entries(data.osCounts).map(([os, count]) => (
              <li key={os} className="flex justify-between">
                {os} <span className="text-green-400">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Countries */}
        <div className=" p-4 rounded-lg -mx-4">
          <p className="bg-green-800 text-white rounded-lg px-2 py-1 items-center">
            Countries
          </p>
          <ul className="mt-2 mx-2">
            {Object.entries(data.countryCounts).map(([country, count]) => (
              <li key={country} className="flex justify-between">
                {country} <span className="text-green-400">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Visits by Day */}
      <div className="mt-8">
        <p className="bg-green-800 text-white rounded-lg px-2 w-fit py-1 items-center">
          Visits by Day
        </p>
        <ul className="mt-2 mx-2">
          {Object.entries(data.visitsByDay).map(([date, count]) => (
            <li key={date} className="flex justify-between">
              {date} <span className="text-green-400">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Visits by Hour */}
      <div className="mt-8">
        <p className="bg-green-800 text-white rounded-lg px-2 w-fit py-1 items-center">
          Visits by Hour
        </p>
        <VisitsByHourLineChart visitsByHour={analyticsData.visitsByHour} />
      </div>

      <div className="mb-8"></div>
      <Footer />
    </main>
  );
}

export default App;
