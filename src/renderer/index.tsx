import { createRoot } from 'react-dom/client';
import App from './App';
import ExportRenderer from './ExportRenderer';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

if (window.electron.windowType === 'main') root.render(<App />);
else root.render(<ExportRenderer />);
