import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export interface NetworkState {
  isOnline: boolean;
  isConnected: boolean;
  type: string | null;
  isInternetReachable: boolean | null;
}

export const useOnline = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: true,
    isConnected: true,
    type: null,
    isInternetReachable: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isOnline: state.isConnected ?? false,
        isConnected: state.isConnected ?? false,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return networkState;
};
