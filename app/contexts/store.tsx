'use client';
import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

type DataType = {
  email: string;
  credits: string;
  sub: string;
  accessToken: string;
}

interface ContextProps {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
}

const GlobalContext = createContext<ContextProps>({
  userId: '',
  setUserId: (): string => '',
  data: { email: '', credits: '', sub: '', accessToken: '' },
  setData: (): DataType => ({ email: '', credits: '', sub: '', accessToken: '' }),
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState('');
  const [data, setData] = useState<DataType>({ email: '', credits: '', sub: '', accessToken: '' });

  return (
    <GlobalContext.Provider value={{ userId, setUserId, data, setData }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);