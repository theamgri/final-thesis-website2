import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
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

      setTimestampData(data);
    } catch (error) {
      console.error('Error fetching timestamp data:', error);
    }
  };

  const identifyDay = (timestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = timestamp.getDay();
    return daysOfWeek[dayIndex];
  };

  const generateWeekLabels = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startOfWeekLabel = 'Sunday';
    const startOfWeekIndex = daysOfWeek.indexOf(startOfWeekLabel);
    return daysOfWeek.slice(startOfWeekIndex).concat(daysOfWeek.slice(0, startOfWeekIndex));
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once when the component mounts

  useEffect(() => {
    if (timestampData.length > 0 && chartRef.current && chartRef.current.getContext) {
      try {
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) {
          console.error('Unable to get chart context.');
          return;
        }

        const weekLabels = generateWeekLabels();
        const labels = timestampData.map((entry) => identifyDay(entry.timestamp));
        const toxicityScores = timestampData.map((entry) => entry.TOXCITY_SCORE);
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

          setChart(newChart);
        } else {
          chart.data.labels = labels;
          chart.data.datasets[0].data = toxicityScores;
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
