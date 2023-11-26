import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { collection, getDocs } from 'firebase/firestore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { db } from './firebase';

const DailyMonthTrends = () => {
  const [timestampData, setTimestampData] = useState([]);
  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tweets'));
      const data = querySnapshot.docs.map((doc) => ({
        timestamp: doc.data().timestamp.toDate(),
      }));

      // Filter data for the current month
      const currentDate = new Date();
      const startOfMonthDate = startOfMonth(currentDate);
      const endOfMonthDate = endOfMonth(currentDate);
      const filteredData = data.filter(
        (entry) => entry.timestamp >= startOfMonthDate && entry.timestamp <= endOfMonthDate
      );

      console.log('Fetched Data:', filteredData);
      setTimestampData(filteredData);
    } catch (error) {
      console.error('Error fetching timestamp data:', error);
    }
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

        const monthLabel = format(new Date(), 'MMMM yyyy');
        const totalDaysWithData = timestampData.length;

        const data = {
          labels: [monthLabel],
          datasets: [
            {
              label: 'Total Days with Data',
              data: [totalDaysWithData],
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
                  labels: [monthLabel], // Set the custom labels
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  suggestedMax: totalDaysWithData + 1, // Add some padding for better visualization
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    title: function (tooltipItem) {
                      return tooltipItem[0].label;
                    },
                    label: function (context) {
                      return `Total Days with Data: ${context.dataset.data[context.dataIndex]}`;
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
      <h2>Daily Month Trends</h2>
      <canvas ref={chartRef} width="800" height="400"></canvas>
    </div>
  );
};

export default DailyMonthTrends;
