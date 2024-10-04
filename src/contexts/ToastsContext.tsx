import { ToastOptions, ToastPosition, useToast } from '@chakra-ui/react';
import { createContext, ReactNode } from 'react';

interface props {
  children: ReactNode;
}

interface ToastsContextProps {
  showToast: (
    title: React.ReactNode,
    status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined,
    description?: React.ReactNode,
    duration?: number,
    isClosable?: boolean,
    position?: ToastPosition
  ) => void;

  showAsyncToast(
    promise: Promise<any>,
    loadingTitle: React.ReactNode,
    successTitle: React.ReactNode,
    loadingDescription?: React.ReactNode,
    successDescription?: React.ReactNode,
    //Setting errorTitle as undefined will show the err.message
    errorTitle?: React.ReactNode,
    errorDescription?: React.ReactNode,
    duration?: number,
    isClosable?: boolean,
    position?: ToastPosition
  ): void;
}

export const ToastsContext = createContext<ToastsContextProps>(
  {} as ToastsContextProps
);

export const ToastsContextProvider = ({ children }: props) => {
  const toast = useToast();

  const toastConfig = {
    duration: 9000,
    isClosable: true,
    position: 'bottom-right' as ToastPosition,
  };

  function showToast(
    title: React.ReactNode,
    status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined,
    description?: React.ReactNode,
    duration = toastConfig.duration,
    isClosable = toastConfig.isClosable,
    position = toastConfig.position
  ) {
    toast({
      title,
      status,
      description,
      duration,
      isClosable,
      position,
    });
  }

  function showAsyncToast(
    promise: Promise<any>,

    loadingTitle: React.ReactNode,
    successTitle: React.ReactNode,
    //Setting errorTitle as undefined will show the err.message
    errorTitle = undefined as undefined | React.ReactNode,

    duration = toastConfig.duration,
    isClosable = toastConfig.isClosable,
    position = toastConfig.position,

    loadingDescription?: React.ReactNode,
    successDescription?: React.ReactNode,
    errorDescription?: React.ReactNode
  ) {
    const standardOptions = {
      duration,
      position,
      isClosable,
    };

    toast.promise(promise, {
      loading: {
        title: loadingTitle,
        description: loadingDescription,
        ...standardOptions,
      },
      success: {
        title: successTitle,
        description: successDescription,
        ...standardOptions,
      },
      error: (err) => ({
        title: errorTitle ?? err.message,
        description: errorDescription,
        ...standardOptions,
      }),
    });
  }

  return (
    <ToastsContext.Provider value={{ showToast, showAsyncToast }}>
      {children}
    </ToastsContext.Provider>
  );
};
