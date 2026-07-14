import { Navigate, Route, Routes } from 'react-router-dom';
import GrowStrongApp from './features/grow-strong/GrowStrongApp';
import SpringsGuidePage from './features/springs-guide/SpringsGuidePage';
import LandingPage from './pages/LandingPage';
import { HomeLink } from './shared/components/HomeLink';

function ToolPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`tool-page ${className}`}><HomeLink />{children}</div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/grow-strong" element={<ToolPage className="grow-strong-page"><GrowStrongApp /></ToolPage>} />
    <Route path="/springs-guide" element={<ToolPage><SpringsGuidePage /></ToolPage>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
