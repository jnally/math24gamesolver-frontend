import React, { useState } from 'react';

const API_URL = 'https://math24gamesolver-backend.onrender.com/api/calculate';

function App() {
  const [inputs, setInputs] = useState({
    num1: '',
    num2: '',
    num3: '',
    num4: '',
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow empty strings, but convert valid numbers to the number type
    setInputs(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    // Basic validation
    for (const key in inputs) {
      if (inputs[key] === '' || isNaN(inputs[key])) {
        setError('Please enter four valid numbers.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong on the server.');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        <header className="text-center">
          <h1 className="text-4xl font-bold text-indigo-700">Math 24 Solver</h1>
          <p className="text-gray-600 mt-2">Enter the four game numbers and all of the solutions will be displayed.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.keys(inputs).map((key, index) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                  Number {index + 1}
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={inputs[key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Calculate'}
          </button>
        </form>

        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Results</h2>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg min-h-[150px] flex items-center justify-center">
            {isLoading && <p className="text-gray-500">Calculating...</p>}
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {!isLoading && !error && results.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {results.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            {!isLoading && !error && results.length === 0 && (
                <p className="text-gray-400">Results will appear here.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
