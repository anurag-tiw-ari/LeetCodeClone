
import React, { useState, useEffect } from 'react';

const BinarySearchVisualization = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [mid, setMid] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(1500);

  // Initialize the array
  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray = Array.from({ length: 15 }, (_, i) => i * 2 + 1); // Sorted array
    setArray(newArray);
    setTarget('');
    setLeft(0);
    setRight(newArray.length - 1);
    setMid(null);
    setIsSearching(false);
    setFoundIndex(-1);
    setSteps([]);
  };

  const startSearch = () => {
    if (target === '' || isNaN(target)) return;
    
    const targetNum = parseInt(target);
    setIsSearching(true);
    setFoundIndex(-1);
    setSteps([]);
    
    let currentLeft = 0;
    let currentRight = array.length - 1;
    let currentSteps = [];
    
    const searchInterval = setInterval(() => {
      if (currentLeft > currentRight) {
        clearInterval(searchInterval);
        setIsSearching(false);
        setSteps(currentSteps);
        return;
      }
      
      const currentMid = Math.floor((currentLeft + currentRight) / 2);
      currentSteps.push({
        left: currentLeft,
        right: currentRight,
        mid: currentMid,
        value: array[currentMid]
      });
      
      setLeft(currentLeft);
      setRight(currentRight);
      setMid(currentMid);
      setSteps([...currentSteps]);
      
      if (array[currentMid] === targetNum) {
        clearInterval(searchInterval);
        setIsSearching(false);
        setFoundIndex(currentMid);
      } else if (array[currentMid] < targetNum) {
        currentLeft = currentMid + 1;
      } else {
        currentRight = currentMid - 1;
      }
    }, speed);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Binary Search Visualization</h1>
          <p className="text-secondary">Visualize how the binary search algorithm works step by step</p>
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
                  <option value={2500}>Slow</option>
                  <option value={1500}>Medium</option>
                  <option value={800}>Fast</option>
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
              </div>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {array.map((value, index) => {
                let className = "w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold transition-all duration-300";
                
                if (foundIndex === index) {
                  className += " bg-success border-success text-success-content";
                } else if (mid === index) {
                  className += " bg-info border-info text-info-content";
                } else if (index >= left && index <= right) {
                  className += " bg-neutral border-neutral text-neutral-content";
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
                <div className="stat-title">Current Range</div>
                <div className="stat-value text-xl">
                  {left} to {right}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Middle Index</div>
                <div className="stat-value text-xl">
                  {mid !== null ? `${mid} (Value: ${array[mid]})` : '—'}
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
                    <th>Left</th>
                    <th>Right</th>
                    <th>Middle</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step, i) => (
                    <tr key={i} className={step.value === parseInt(target) ? 'bg-success bg-opacity-20' : ''}>
                      <th>{i + 1}</th>
                      <td>{step.left}</td>
                      <td>{step.right}</td>
                      <td>{step.mid}</td>
                      <td>{step.value}</td>
                      <td>
                        {step.value === parseInt(target) ? (
                          <span className="text-success">Found!</span>
                        ) : step.value < parseInt(target) ? (
                          <span className="text-warning">Go right</span>
                        ) : (
                          <span className="text-info">Go left</span>
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
            <h2 className="card-title">How Binary Search Works</h2>
            <div className="prose">
              <ul>
                <li>Binary search requires the array to be <strong>sorted</strong></li>
                <li>It maintains two pointers (<code>left</code> and <code>right</code>) that represent the current search range</li>
                <li>At each step, it checks the <strong>middle element</strong> of the current range</li>
                <li>If the middle element matches the target, the search is complete</li>
                <li>If the target is <strong>greater</strong> than the middle element, it searches the <strong>right half</strong></li>
                <li>If the target is <strong>smaller</strong> than the middle element, it searches the <strong>left half</strong></li>
                <li>This process continues until the target is found or the search range is empty</li>
                <li>Binary search has a time complexity of <code>O(log n)</code>, making it very efficient for large datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualization;