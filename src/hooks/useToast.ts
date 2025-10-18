import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  showAlert?: boolean;
}

interface ToastState {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'info',
    title: '',
  });

  const showToast = useCallback((options: ToastOptions) => {
    const { type, title, message, duration = 3000, showAlert = false } = options;

    setToast({
      visible: true,
      type,
      title,
      message,
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, duration);
    }

    // Show native alert if requested
    if (showAlert) {
      const alertTitle = getAlertTitle(type);
      Alert.alert(alertTitle, message || title);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const getAlertTitle = (type: ToastType): string => {
    const titles = {
      success: 'Sucesso',
      error: 'Erro',
      info: 'Informação',
      warning: 'Atenção',
    };
    return titles[type];
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
