import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UILanguageProvider } from './contexts/UILanguageContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <UILanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </UILanguageProvider>
  );
}

export default App;