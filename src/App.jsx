import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f3f4f6' }}>
      <header className="App-header">
        <h1 style={{ color: '#ff6b6b' }}>Welcome to Our Bakery</h1>
      </header>
      <section className="premium-color-scheme">
        <h2>Light Premium Color Scheme</h2>
        <p>We've made some updates to our color scheme for a lighter and more vibrant feel.</p>
      </section>
      <section className="bouquet-modal">
        <h2>Realistic Bouquet Modal</h2>
        <button onClick={() => alert('Bouquet Modal opened!')}>Show Bouquets</button>
      </section>
      <section className="interaction-section">
        <h2>Cake & Blow Interaction</h2>
        <p>Engage with our cakes and blow them out!</p>
        <button onClick={() => alert('Cake blown out!')}>Blow out the cake!</button>
      </section>
      <footer className="App-footer">
        <p>Thank you for visiting!</p>
      </footer>
    </div>
  );
}

export default App;
