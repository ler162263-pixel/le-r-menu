import React from 'react';
import { HashRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppErrorBoundary, ToastContainer } from './components/common';
import {
  LanguageProvider,
  RestaurantDataProvider,
  ThemeProvider,
  ToastProvider,
} from './contexts';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <AppErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <RestaurantDataProvider>
                <HashRouter>
                  <AppRoutes />
                  <ToastContainer />
                </HashRouter>
              </RestaurantDataProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </MotionConfig>
    </AppErrorBoundary>
  );
}

export default App;
