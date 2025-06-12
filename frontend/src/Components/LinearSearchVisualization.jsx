
import React, { useState, useEffect } from 'react';

const LinearSearchVisualization = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(1000);
//   const [isSorted, setIsSorted] = useState(false);

  // Initialize the array
  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setTarget('');
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setIsSearching(false);
    setSteps([]);
  };

//   const toggleSort = () => {
//     if (isSearching) return;
//     const newArray = [...array];
//     if (isSorted) {
//       newArray.sort(() => Math.random() - 0.5); // Shuffle
//     } else {
//       newArray.sort((a, b) => a - b); // Sort
//     }
//     setArray(newArray);
//     setIsSorted(!isSorted);
//   };

  const startSearch = () => {
    if (target === '' || isNaN(target)) return;
    
    const targetNum = parseInt(target);
    setIsSearching(true);
    setFoundIndex(-1);
    setSteps([]);
    setCurrentIndex(-1);
    
    let i = 0;
    const searchInterval = setInterval(() => {
      if (i >= array.length) {
        clearInterval(searchInterval);
        setIsSearching(false);
        return;
      }
      
      setCurrentIndex(i);
      setSteps(prev => [...prev, {
        index: i,
        value: array[i],
        found: array[i] === targetNum
      }]);
      
      if (array[i] === targetNum) {
        clearInterval(searchInterval);
        setIsSearching(false);
        setFoundIndex(i);
      }
      
      i++;
    }, speed);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Linear Search Visualization</h1>
          <p className="text-secondary">Visualize how the linear search algorithm works step by step</p>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Target Value</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter target value"
                  className="input input-bordered w-full"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={isSearching}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Speed (ms)</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  disabled={isSearching}
                >
                  <option value={1500}>Slow</option>
                  <option value={1000}>Medium</option>
                  <option value={500}>Fast</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={startSearch}
                  disabled={isSearching || target === ''}
                >
                  {isSearching ? (
                    <span className="loading loading-spinner"></span>
                  ) : 'Start Search'}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={resetArray}
                  disabled={isSearching}
                >
                  Reset
                </button>
                {/* <button 
                  className={`btn ${isSorted ? 'btn-accent' : 'btn-outline'}`}
                  onClick={toggleSort}
                  disabled={isSearching}
                >
                  {isSorted ? 'Shuffle' : 'Sort'}
                </button> */}
              </div>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {array.map((value, index) => {
                let className = "w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold transition-all duration-300";
                
                if (foundIndex === index) {
                  className += " bg-success border-success text-success-content";
                } else if (currentIndex === index) {
                  className += " bg-info border-info text-info-content";
                } else if (currentIndex > index && foundIndex === -1) {
                  className += " bg-neutral border-neutral text-neutral-content opacity-70";
                } else {
                  className += " bg-base-300 border-base-300";
                }
                
                return (
                  <div key={index} className={className}>
                    {value}
                  </div>
                );
              })}
            </div>

            <div className="stats shadow bg-base-200 mb-4">
              <div className="stat">
                <div className="stat-title">Current Index</div>
                <div className="stat-value text-xl">
                  {currentIndex >= 0 ? currentIndex : '—'}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Current Value</div>
                <div className="stat-value text-xl">
                  {currentIndex >= 0 ? array[currentIndex] : '—'}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Result</div>
                <div className="stat-value text-xl">
                  {foundIndex !== -1 ? (
                    <span className="text-success">Found at {foundIndex}</span>
                  ) : steps.length > 0 && !isSearching ? (
                    <span className="text-error">Not found</span>
                  ) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Search Steps</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Index</th>
                    <th>Value</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step, i) => (
                    <tr key={i} className={step.found ? 'bg-success bg-opacity-20' : ''}>
                      <th>{i + 1}</th>
                      <td>{step.index}</td>
                      <td>{step.value}</td>
                      <td>
                        {step.found ? (
                          <span className="text-success">Found!</span>
                        ) : (
                          <span className="text-warning">Not matched</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">How Linear Search Works</h2>
            <div className="prose">
              <ul>
                <li>Linear search checks each element in the array <strong>sequentially</strong></li>
                <li>Unlike binary search, the array <strong>doesn't need to be sorted</strong></li>
                <li>It starts from the first element and compares each element with the target value</li>
                <li>If a match is found, it returns the index of that element</li>
                <li>If no match is found after checking all elements, it returns "not found"</li>
                <li>Linear search has a time complexity of <code>O(n)</code> in the worst case</li>
                <li>It's simple to implement but less efficient than binary search for large datasets</li>
                <li>The average case performance is <code>O(n/2)</code> when the item is present</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearchVisualization;