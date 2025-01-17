import React from 'react';
    import { Routes, Route, Link } from 'react-router-dom';
    import Home from './pages/Home';
    import PumpingStation from './pages/PumpingStation';
    import Doors from './pages/Doors';
    import Counters from './pages/Counters';

    function App() {
      return (
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pumping-station" element={<PumpingStation />} />
            <Route path="/doors" element={<Doors />} />
            <Route path="/counters" element={<Counters />} />
          </Routes>
        </div>
      );
    }

    export default App;
