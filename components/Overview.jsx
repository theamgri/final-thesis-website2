import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Doughnut } from 'react-chartjs-2';

const HateSpeechOverview = () => {
  const [totalHateSpeech, setTotalHateSpeech] = useState(0);
  const [totalContent, setTotalContent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hateSpeechData, setHateSpeechData] = useState([]); // Initialize an empty array

  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, 'tweets'));
      const updatedHateSpeechData = []; // Initialize to an empty array
      let updatedTotalHateSpeech = 0; // Initialize to 0

      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        const toxicityScore = entry.TOXCITY_SCORE;

        if (typeof toxicityScore === 'number' || !isNaN(Number(toxicityScore))) {
          const isHateSpeech = Number(toxicityScore) > 0.5;
          updatedHateSpeechData.push({ ...entry, isHateSpeech });
          updatedTotalHateSpeech += isHateSpeech ? 1 : 0;
        } else {
          // Handle non-numeric or invalid scores if necessary
          console.error('Invalid toxicity score:', toxicityScore);
        }
      });

      setHateSpeechData(updatedHateSpeechData);
      setTotalContent(querySnapshot.size);
      setTotalHateSpeech(updatedTotalHateSpeech); // Update the totalHateSpeech state
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: ['Hate Speech', 'Non-Hate Speech'],
    datasets: [{
      data: [totalHateSpeech, totalContent - totalHateSpeech],
      backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
    }],
  };

  const hateSpeechPercentage = totalContent === 0 ? 0 : ((totalHateSpeech / totalContent) * 100).toFixed(2);

  return (
    <div>
      <h2>Hate Speech Overview</h2>
      {loading ? <p>Loading data...</p> : error ? (
        <p>An error occurred while fetching data: {error.message}</p>
      ) : (
        <div className="pt-4 font-mono">
          <Doughnut data={data} />
          <p className="font-bold pt-5">Total Hatespeech: {totalHateSpeech}</p> 
          <p>Total Hate Speech Incidents: {totalHateSpeech}</p>
          <p>Hate Speech Percentage: {hateSpeechPercentage}%</p>
        </div>
      )}
    </div>
  );
};

export default HateSpeechOverview;
