import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const SentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState(new Set());
  const chartRef = useRef(null);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tweets'));
      const data = [];

      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        data.push({
          category: entry.category,
          toxicity_score: Array.isArray(entry.toxicity_score) ? entry.toxicity_score[0] : entry.toxicity_score,
        });

        // Track unique categories
        if (entry.category) {
          setUniqueCategories((prevCategories) => {
            return new Set([...prevCategories, entry.category]);
          });
        }
      });

      console.log('Fetched Sentiment Data:', data); // Log the fetched data
      setSentimentData(data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    }
  };

  const calculateCategoryCounts = () => {
    const categoryCounts = {};

    sentimentData.forEach((entry) => {
      if (entry.category) {
        categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
      }
    });

    return categoryCounts;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (sentimentData.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const categoryCounts = calculateCategoryCounts();

      const labels = Array.from(uniqueCategories);
      const data = labels.map((category) => categoryCounts[category] || 0);

      // Destroy existing chart if it exists
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const newChart = new Chart(ctx, {
        type: 'bar', // Change chart type to bar
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Category Counts',
              data: data,
              backgroundColor: 'rgba(255, 99, 132, 0.5)', // Change color to red
              borderColor: 'rgba(255, 99, 132, 1)', // Change border color to red
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: Math.max(...data) + 1,
            },
          },
        },
      });

      // Store the chart instance in the ref
      chartRef.current.chart = newChart;
    }
  }, [sentimentData, uniqueCategories]);

  return (
    <div>
      <h2>Sentiment Analysis Chart</h2>
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
};

export default SentimentAnalysis;
