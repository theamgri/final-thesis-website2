import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, deleteDoc, doc } from './firebase.jsx';

const ReportCard = ({ report, onDelete }) => {
    const handleDelete = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this report?');
  
      if (confirmDelete) {
        try {
          const reportRef = doc(db, 'reports', report.id);
          await deleteDoc(reportRef);
          onDelete(report.id);
        } catch (error) {
          console.error('Error deleting report:', error);
        }
      }
    };
  
    const formattedTimestamp = new Date(report.timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });
  
    return (
      <div className="bg-slate-900 w-full md:w-1/2 lg:w-1/3 p-2 rounded overflow-hidden shadow-lg m-4 p-4">
        <div className="font-bold text-xl mb-2">{report.text}</div>
        <div className="text-gray-400 mb-2">{report.category}</div>
        <div className="text-gray-400 mb-2">{`${report.TOXCITY_SCORE}`}</div>
        <div className="text-gray-400">{`${formattedTimestamp}`}</div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    );
  };
  
  const ReportsPage = () => {
    const [reports, setReports] = useState([]);
  
    useEffect(() => {
      const fetchReports = async () => {
        try {
          const reportsCollection = collection(db, 'reports');
          const querySnapshot = await getDocs(reportsCollection);
  
          if (querySnapshot.empty) {
            console.log('No reports found.');
          } else {
            const data = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp.toDate(),
            }));
            console.log('Fetched Reports:', data);
            setReports(data);
          }
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      };
  
      fetchReports();
    }, []);
  
    const handleDeleteReport = (reportId) => {
      setReports(reports.filter(report => report.id !== reportId));
    };
  
    return (
      <div className="mt-5 justify-center items-center h-screen w-screen">
        <div>
          <h1 className="ml-5 text-2xl opacity-50 font-bold mb-4 font-mono">Reports Page</h1>
          {reports.length === 0 ? (
            <p>No reports available.</p>
          ) : (
            <div className="flex flex-wrap">
              {reports.map(report => (
                <ReportCard key={report.id} report={report} onDelete={handleDeleteReport} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ReportsPage;
  