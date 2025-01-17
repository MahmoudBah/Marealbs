import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PumpingStation.css';

const PumpingStation = () => {
  const [workerName, setWorkerName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [pumpStates, setPumpStates] = useState({
    mr2: { active: false, basins: [] },
    mr3: { active: false, basins: [] },
    mr4: { active: false, basins: [] },
    mr5: { active: false, basins: [] },
    warman: { active: false, basins: [] },
    pompeMG: { active: false },
    pompeEauDeMer: { active: false }
  });
  const [netDensite, setNetDensite] = useState('');
  const [ngtValue, setNgtValue] = useState('');
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePumpToggle = (pump) => {
    setPumpStates(prev => ({
      ...prev,
      [pump]: { 
        ...prev[pump], 
        active: !prev[pump].active,
        ...(pump === 'mr2' || pump === 'mr3' || pump === 'mr4' || pump === 'mr5' || pump === 'warman' 
          ? { basins: [] }
          : {}
        )
      }
    }));
  };

  const handleBasinChange = (pump, basin) => {
    setPumpStates(prev => {
      const currentBasins = prev[pump].basins;
      const updatedBasins = currentBasins.includes(basin)
        ? currentBasins.filter(b => b !== basin)
        : [...currentBasins, basin].slice(0, 3);
      
      return {
        ...prev,
        [pump]: { ...prev[pump], basins: updatedBasins }
      };
    });
  };

  const renderBasinSelectors = (pump, state) => {
    const basinsToShow = Math.min(3, state.basins.length + 1);
    
    return (
      <div className="basin-selectors">
        {[...Array(basinsToShow).keys()].map((_, index) => {
          const selectedBasin = state.basins[index] || '';
          return (
            <select
              key={index}
              value={selectedBasin}
              onChange={(e) => handleBasinChange(pump, e.target.value)}
              className="basin-select"
            >
              <option value="">Select Basin {index + 1}</option>
              {[...Array(10).keys()].map(i => {
                const basin = `B${i + 1}`;
                if (!state.basins.includes(basin) || basin === selectedBasin) {
                  return (
                    <option key={basin} value={basin}>
                      {basin}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          );
        })}
      </div>
    );
  };

  const handleNewForm = () => {
    setWorkerName('');
    setPumpStates({
      mr2: { active: false, basins: [] },
      mr3: { active: false, basins: [] },
      mr4: { active: false, basins: [] },
      mr5: { active: false, basins: [] },
      warman: { active: false, basins: [] },
      pompeMG: { active: false },
      pompeEauDeMer: { active: false }
    });
    setNetDensite('');
    setNgtValue('');
    setSelectedForm(null);
  };

  const handleModifyForm = (form) => {
    setSelectedForm(form.id);
    setWorkerName(form.worker);
    setPumpStates(form.data.pumpStates);
    setNetDensite(form.data.netDensite);
    setNgtValue(form.data.ngtValue);
  };

  const handleDeleteForm = (id) => {
    setFormSubmissions(formSubmissions.filter(form => form.id !== id));
  };

  const handleSubmit = () => {
    if (!workerName.trim()) {
      alert('Please enter your name');
      return;
    }

    const newForm = {
      id: selectedForm || Date.now(),
      date: new Date().toISOString(),
      worker: workerName,
      data: { pumpStates, netDensite, ngtValue }
    };

    if (selectedForm) {
      const updatedForms = formSubmissions.map(form =>
        form.id === selectedForm ? newForm : form
      );
      setFormSubmissions(updatedForms);
    } else {
      setFormSubmissions([newForm, ...formSubmissions]);
    }

    handleNewForm();
  };

  const isSubmitDisabled = !netDensite || !ngtValue;

  return (
    <div className="pumping-station">
      <header>
        <div className="worker-name">
          <input
            type="text"
            placeholder="Enter your name"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
          />
        </div>
        <Link to="/" className="home-link">🏠</Link>
      </header>

      <div className="main-container">
        <div className="left-section">
          <h3>Form Submissions</h3>
          <button className="nouveau" onClick={handleNewForm}>
            New Form
          </button>
          <div className="submissions-list">
            {formSubmissions.map(form => (
              <div key={form.id} className="submission-item">
                <div className="submission-info">
                  <div className="worker">{form.worker}</div>
                  <div className="date">{new Date(form.date).toLocaleString()}</div>
                </div>
                <div className="form-actions">
                  <button className="modify" onClick={() => handleModifyForm(form)}>
                    Modify
                  </button>
                  <button className="delete" onClick={() => handleDeleteForm(form.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-section">
          <div className="datetime">
            {currentDateTime.toLocaleString()}
          </div>

          <div className="controls-container">
            <div className="metrics-section">
              <div className="metric">
                <label>NET Densité:</label>
                <input
                  type="number"
                  value={netDensite}
                  onChange={(e) => setNetDensite(e.target.value)}
                  min="1000"
                  required
                />
              </div>
              <div className="metric">
                <label>NGT:</label>
                <input
                  type="number"
                  value={ngtValue}
                  onChange={(e) => setNgtValue(e.target.value)}
                  max="0"
                  required
                />
              </div>
            </div>

            <div className="pumps-section">
              <h3>Pump Controls</h3>
              <div className="pump-controls">
                {Object.entries(pumpStates).map(([pump, state]) => (
                  <div key={pump} className="pump">
                    <div className="pump-info">
                      <div className="pump-name">
                        {pump === 'pompeMG' ? 'Pompe MG' : 
                         pump === 'pompeEauDeMer' ? 'Pompe eau de Mer' : 
                         pump.toUpperCase()}
                      </div>
                      <button
                        className={state.active ? 'active' : 'inactive'}
                        onClick={() => handlePumpToggle(pump)}
                      >
                        {state.active ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    {(pump !== 'pompeMG' && pump !== 'pompeEauDeMer') && 
                      state.active && renderBasinSelectors(pump, state)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer>
            <button
              className="submit"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PumpingStation;
