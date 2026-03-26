"use client"
import { useState, createContext } from "react";

interface ViewDetailsData {
  img: string;
  title: string;
  size: number;
  description: string;
}

interface ViewDetailsContextType {
  details: boolean;
  setDetails: (v: boolean) => void;
  amount: number;
  setAmount: (v: number) => void;
  id: number;
  setId: (v: number) => void;
  data: ViewDetailsData;
  setData: (v: ViewDetailsData) => void;
}

export const ViewDetailsContext = createContext<ViewDetailsContextType | null>(null);

export const ViewDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [details, setDetails] = useState(false);
  const [amount, setAmount] = useState(1);
  const [id, setId] = useState(0);
  const [data, setData] = useState<ViewDetailsData>({
    img: "",
    title: "",
    size: 0,
    description: "",
  });

  return (
    <ViewDetailsContext.Provider
      value={{ details, setDetails, amount, setAmount, id, setId, data, setData }}
    >
      {children}
    </ViewDetailsContext.Provider>
  );
};
