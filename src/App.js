import React from 'react';
import RulesTable from './components/RulesTable';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-secondary py-8 px-4 shadow-lg mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white text-center">
            Regulatory Rules Table
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4">
        <RulesTable />
      </main>
    </div>
  );
}

export default App;
