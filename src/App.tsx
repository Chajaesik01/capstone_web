import GlobalStyle from './GlobalStyle';
import { Router } from '@/routes/Router';
import { AuthProvider } from '@/store/AuthContext';

function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Router />
    </AuthProvider>
  );
}

export default App;
