import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import './Counters.css';

    const Counters = () => {
      const navigate = useNavigate();
      const [currentDateTime, setCurrentDateTime] = useState(new Date());
      const [counters, setCounters] = useState({
        mr2: 100,
        mr3: 150,
        mr4: 200,
        mr5: 250,
        warman: 300
      });
      const [initialCounters, setInitialCounters] = useState({ ...counters });

      useEffect(() => {
        const timer = setInterval(() => {
          setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
      }, []);

      const handleCounterChange = (pump, delta) => {
        setCounters(prev => ({
          ...prev,
          [pump]: Math.max(0, prev[pump] + delta)
        }));
      };

      const handleIgnore = () => {
        setCounters({ ...initialCounters });
      };

      const handleSave = () => {
        setInitialCounters({ ...counters });
        alert('Counter values saved successfully!');
      };

      return (
        <div className="counters">
          <header>
            <Link to="/" className="home-link">🏠</Link>
            <h1>Compteurs</h1>
            <button className="back-link" onClick={() => navigate(-1)}>🔙</button>
          </header>

          <div className="content">
            <div className="datetime">
              {currentDateTime.toLocaleString()}
            </div>

            <div className="counter-controls">
              {Object.entries(counters).map(([pump, value]) => (
                <div key={pump} className="counter">
                  <label>{pump.toUpperCase()} Counter:</label>
                  <div className="counter-value">{value}</div>
                  <div className="counter-buttons">
                    <button
                      className="increment"
                      onClick={() => handleCounterChange(pump, 1)}
                    >
                      +
                    </button>
                    <button
                      className="decrement"
                      onClick={() => handleCounterChange(pump, -1)}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="ignore" onClick={handleIgnore}>
                Ignore
              </button>
              <button className="save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default Counters;
