import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UILanguageProvider } from './contexts/UILanguageContext';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';

function App() {
  return (
    <UILanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
      </Router>
    </UILanguageProvider>
  );
}

export default App;