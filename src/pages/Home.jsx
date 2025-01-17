import React from 'react';
    import { Link } from 'react-router-dom';
    import './Home.css';

    export default function Home() {
      return (
        <div className="home">
          <h1>MareAlbs</h1>
          <div className="buttons">
            <Link to="/pumping-station">
              <button>Station de pompage</button>
            </Link>
            <Link to="/doors">
              <button>Portes</button>
            </Link>
          </div>
        </div>
      );
    }
