import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export default function YearHeatmap({id}) {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
        setAvailableYears(years);
        await fetchHeatmapData(currentYear);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to initialize');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const fetchHeatmapData = async (year) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.post(`/user/heatMap/${id}`, { year });
      setHeatmapData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load heatmap data');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    fetchHeatmapData(year);
  };

  // Improved color scaling with better contrast
  const getColorClass = (count) => {
    if (!count) return 'color-empty';
    if (count === 1) return 'color-scale-1';
    if (count === 2) return 'color-scale-2';
    if (count === 3) return 'color-scale-3';
    if (count == 4) return 'color-scale-4';
    if (count == 5) return 'color-scale-5';
    if (count == 6) return 'color-scale-6';
    if (count == 6) return 'color-scale-7';
    if (count == 8) return 'color-scale-8';
    if (count == 9) return 'color-scale-9';
    return 'color-scale-10';
  };

  const handleMouseEnter = (event, value) => {
    if (value) {
      const rect = event.target.getBoundingClientRect();
      setTooltip({
        visible: true,
        content: `${value.date}: ${value.count} submission${value.count !== 1 ? 's' : ''}`,
        x: rect.left + rect.width / 2,
        y: rect.top - 40
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-15">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Submission Activity</h2>
        <div className="flex items-center gap-3">
          <select 
            value={selectedYear}
            onChange={handleYearChange}
            disabled={loading}
            className="select select-bordered select-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {loading && <span className="loading loading-spinner loading-sm text-primary"></span>}
        </div>
              <div className="flex justify-center mt-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex gap-1">
            <span className="w-4 h-4 rounded-sm bg-[#ebedf0]"></span>
            <span className="w-4 h-4 rounded-sm bg-[#9be9a8]"></span>
            <span className="w-4 h-4 rounded-sm bg-[#40c463]"></span>
            <span className="w-4 h-4 rounded-sm bg-[#30a14e]"></span>
            <span className="w-4 h-4 rounded-sm bg-[#216e39]"></span>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
        {!loading && !error && (
          <div className="overflow-x-auto">
            <CalendarHeatmap
              startDate={new Date(`${selectedYear}-01-01`)}
              endDate={new Date(`${selectedYear}-12-31`)}
              values={heatmapData}
              classForValue={(value) => getColorClass(value?.count)}
            //   weekdayLabels={["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"]}
              showWeekdayLabels={true}
              gutterSize={1}  // Reduced gutter size for better spacing
              onMouseOver={(event, value) => handleMouseEnter(event, value)}
              onMouseLeave={handleMouseLeave}
              horizontal={true}
            />
          </div>
        )}

        {/* Custom tooltip */}
        {tooltip.visible && (
          <div 
            className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {tooltip.content}
            <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-900 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
          </div>
        )}
      </div>


      <style jsx global>{`
        .react-calendar-heatmap {
          height: 160px;
        }

        .react-calendar-heatmap rect {
          rx: 1;
          ry: 1;
          stroke: rgba(255, 255, 255, 0.02);
          stroke-width: 1px
        }
        .react-calendar-heatmap .color-empty {
          fill: #dcdcdc;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #9be9a8;
        }
        .react-calendar-heatmap .color-scale-2 {
           fill: #7ddd91; 
        }

        .dark .react-calendar-heatmap .color-empty {
          fill: #5a5a5a;
        }
        
        .react-calendar-heatmap .color-scale-3 { fill: #5ed07a; }

        .react-calendar-heatmap .color-scale-4 { fill: #40c463; }

        .react-calendar-heatmap .color-scale-5 { fill: #3bb85c; }

        .react-calendar-heatmap .color-scale-6 { fill: #35ad55; }

        .react-calendar-heatmap .color-scale-7 { fill: #30a14e; }

        .react-calendar-heatmap .color-scale-8 { fill: #2b9047; }

        .react-calendar-heatmap .color-scale-9 { fill: #267f40; }

        .react-calendar-heatmap .color-scale-10 { fill: #216e39; }

        }
        .react-calendar-heatmap text {
          font-size: 9px;
          fill: #767676;
        }
        .dark .react-calendar-heatmap text {
          fill: #a0aec0;
        }
        .react-calendar-heatmap .month-label {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}