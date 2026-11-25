import { useContext } from 'react';
import {
  RestaurantDataContext,
  type RestaurantDataContextValue,
} from '../contexts/RestaurantDataContext';

export function useRestaurantData(): RestaurantDataContextValue {
  const ctx = useContext(RestaurantDataContext);
  if (!ctx) {
    throw new Error(
      'useRestaurantData must be used within RestaurantDataProvider'
    );
  }
  return ctx;
}
