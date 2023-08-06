'use client';
import React, { useState } from 'react';
import { runApiCalls } from './api';
import { AuthCheck } from './Authenticated';
import { useGlobalContext } from './contexts/store';

interface ApiResult {
  phoneNumber: string;
  data: boolean;
}

function Validator(): JSX.Element {
  const [results, setResults] = useState<ApiResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId, data } = useGlobalContext();

  const handleRunApiCalls = async (): Promise<void> => {
    setIsLoading(true);
    const numbersToRun = [
      '5551984518706', 
      '5551234567890', 
    ];

    if (userId && data.credits)
      try {
        const apiResults = await runApiCalls(numbersToRun, data.email);
        setResults(apiResults);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    else
      setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 space-y-8">
      <button onClick={handleRunApiCalls} disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {isLoading ? 'Running...' : 'Run API Calls'}
      </button>
      <h1>API Call Results:</h1>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{JSON.stringify(result)}</li>
        ))}
      </ul>
    </div>
  );
}

export default AuthCheck(Validator);