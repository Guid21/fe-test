import './App.css';
import { HomePage } from './pages/HomePage';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import ReactRouterDomProvider from './shared/providers/ReactRouterDomProvider';
import WSProvider from './shared/providers/WSProvider';

function App() {
  return (
    <ReactRouterDomProvider>
      <ReactQueryProvider>
        <WSProvider>
          <HomePage />
        </WSProvider>
      </ReactQueryProvider>
    </ReactRouterDomProvider>
  );
}

export default App;
