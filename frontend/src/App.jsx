import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UILanguageProvider } from './contexts/UILanguageContext';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import HowToUsePage from './pages/HowToUsePage';

function App() {
  return (
    <UILanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
        </Routes>
      </Router>
    </UILanguageProvider>
  );
}

export default App;