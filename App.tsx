import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/app/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/components/common/LoadingScreen';
import { fetchExchangeRates } from './src/features/currency/currencySlice';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExchangeRates() as any);
  }, []);

  return <AppNavigator />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
