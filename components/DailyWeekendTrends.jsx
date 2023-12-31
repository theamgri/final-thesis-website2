import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { collection, getDocs } from 'firebase/firestore';
import { startOfWeek, endOfWeek } from 'date-fns';
import { db } from './firebase';

const DailyWeekendTrends = () => {
  const [timestampData, setTimestampData] = useState([]);
  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tweets'));
      const data = querySnapshot.docs.map((doc) => {
        const entry = doc.data();
        return {
          timestamp: entry.timestamp.toDate(),
          TOXCITY_SCORE: entry.TOXCITY_SCORE,
        };
      });

      const currentDate = new Date();
      const startOfWeekDate = startOfWeek(currentDate);
      const endOfWeekDate = endOfWeek(currentDate);

      // Filter data for the current week
      const filteredData = data.filter(
        (entry) => entry.timestamp >= startOfWeekDate && entry.timestamp <= endOfWeekDate
      );

      console.log('Fetched Data for the current week:', filteredData);
      setTimestampData(filteredData);
    } catch (error) {
      console.error('Error fetching timestamp data:', error);
    }
  };

  const identifyDay = (timestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = timestamp.getDay();
    return daysOfWeek[dayIndex];
  };

  const generateWeekLabels = (startOfWeekDate) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startOfWeekIndex = startOfWeekDate.getDay();
    return daysOfWeek.slice(startOfWeekIndex).concat(daysOfWeek.slice(0, startOfWeekIndex));
  };

  const groupDataByDay = (data) => {
    const groupedData = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Initialize the count to 0 for each day of the week
    daysOfWeek.forEach(day => {
      groupedData[day] = 0;
    });
  
    data.forEach((entry) => {
      const day = identifyDay(entry.timestamp);
      groupedData[day]++;
    });
  
    return groupedData;
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data periodically (e.g., every 10 minutes)
    }, 600000);

    return () => clearInterval(intervalId);
  }, []); // Run once when the component mounts

  useEffect(() => {
    if (timestampData.length > 0 && chartRef.current && chartRef.current.getContext) {
      try {
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) {
          console.error('Unable to get chart context.');
          return;
        }

        const startOfWeekDate = startOfWeek(new Date());
        const weekLabels = generateWeekLabels(startOfWeekDate);
        const groupedData = groupDataByDay(timestampData);

        const data = {
          labels: Object.keys(groupedData),
          datasets: [
            {
              label: 'Total Inputs in a Day',
              data: Object.values(groupedData),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        if (!chart) {
          const newChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
              scales: {
                x: {
                  stacked: true,
                  labels: weekLabels, // Set the custom labels
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  suggestedMax: Math.max(...Object.values(groupedData)) + 1, // Adjust the scale
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    title: function (tooltipItem) {
                      return tooltipItem[0].label;
                    },
                    label: function (context) {
                      return `Total Inputs: ${context.dataset.data[context.dataIndex]}`;
                    },
                  },
                },
              },
            },
          });

          setChart(newChart);
        } else {
          chart.data.labels = data.labels;
          chart.data.datasets[0].data = data.datasets[0].data;
          chart.data.datasets[0].backgroundColor = data.datasets[0].backgroundColor;
          chart.data.datasets[0].borderColor = data.datasets[0].borderColor;
          chart.update();
        }
      } catch (error) {
        console.error('Error creating/updating chart:', error);
      }
    }
  }, [timestampData, chart]);

  return (
    <div className="w-full">
      <h2>Daily Weekend Trends</h2>
      <canvas ref={chartRef} width="800" height="400"></canvas>
    </div>
  );
};

export default DailyWeekendTrends;
