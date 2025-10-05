import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, AppAction } from '../types';
import { appReducer, initialState } from './appReducer';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('kalamitra_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.user) dispatch({ type: 'SET_USER', payload: parsed.user });
        parsed.products?.forEach((p: any) => dispatch({ type: 'ADD_PRODUCT', payload: p }));
        parsed.orders?.forEach((o: any) => dispatch({ type: 'ADD_ORDER', payload: o }));
        parsed.disputes?.forEach((d: any) => dispatch({ type: 'ADD_DISPUTE', payload: d }));
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      products: state.products,
      orders: state.orders,
      disputes: state.disputes,
    };
    localStorage.setItem('kalamitra_state', JSON.stringify(stateToSave));
  }, [state.user, state.products, state.orders, state.disputes]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
