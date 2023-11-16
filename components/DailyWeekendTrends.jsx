import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
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
  
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Assuming Monday is the start of the week
      const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  
      const filteredData = data.filter((entry) =>
        isWithinInterval(entry.timestamp, { start: currentWeekStart, end: currentWeekEnd })
      );
  
      const sortedData = filteredData.sort((a, b) => a.timestamp - b.timestamp);
      console.log('Fetched Timestamp Data for This Week:', sortedData);
  
      setTimestampData(sortedData);
    } catch (error) {
      console.error('Error fetching timestamp data:', error);
    }
  };
  

  const countDocuments = async () => {
    try {
      // Use the same query as fetchData
      const querySnapshot = await getDocs(query(collection(db, 'tweets'), where('TOXCITY_SCORE', '>', 0.5)));
      const documentCount = querySnapshot.size;
      console.log('Document Count:', documentCount);
    } catch (error) {
      console.error('Error counting documents:', error);
    }
  };

  const identifyDay = (timestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = timestamp.getDay();
    return daysOfWeek[dayIndex];
  };

  const updateWeeklyChart = () => {
    // Implement the logic to update only the specific day on the chart if a new week has started
    // Use the data from the previous week for the remaining days
    // You can use moment.js or similar library to handle date manipulations
    // Example: https://momentjs.com/docs/#/manipulating/
  };

  useEffect(() => {
    fetchData();
    countDocuments();
  }, []); // Run once when the component mounts



  useEffect(() => {
    console.log('Timestamp Data:', timestampData);

    if (timestampData.length > 0 && chartRef.current) {
      try {
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) {
          console.error('Unable to get chart context.');
          return;
        }

        const labels = timestampData.map((entry) => identifyDay(entry.timestamp));

        const toxicityScores = timestampData.map((entry) => entry.TOXCITY_SCORE);

        console.log('Labels:', labels);
        console.log('Toxicity Scores:', toxicityScores);

        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Toxicity Scores Progress',
              data: toxicityScores,
              backgroundColor: toxicityScores.map((score) =>
                score > 0.5 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)'
              ),
              borderColor: toxicityScores.map((score) =>
                score > 0.5 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
              ),
              borderWidth: 1,
            },
          ],
        };

        console.log('Data:', data);

        if (!chart) {
          const newChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  suggestedMax: 1,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    title: function (tooltipItem) {
                      return tooltipItem[0].label;
                    },
                    label: function (context) {
                      return `Toxicity Score: ${context.dataset.data[context.dataIndex]}`;
                    },
                  },
                },
              },
            },
          });

          console.log('Chart created:', newChart);
          setChart(newChart);
        } else {
          chart.data.labels = labels;
          chart.data.datasets[0].data = toxicityScores;
          chart.data.datasets[0].backgroundColor = data.datasets[0].backgroundColor;
          chart.data.datasets[0].borderColor = data.datasets[0].borderColor;
          chart.update();
          console.log('Chart updated:', chart);
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