"use client"
import { useState, createContext } from "react";

type ColorRelation = {
  colors: { name: string; hex_code: string };
};


interface ViewDetailsData {
  img: string;
  title: string;
  size: string;
  description: string;
  category: string | null;
  material: string | null;
  colores: ColorRelation[];
}

interface ViewDetailsContextType {
  details: boolean;
  setDetails: (v: boolean) => void;
  amount: number;
  setAmount: (v: number) => void;
  id: string;
  setId: (v: string) => void;
  data: ViewDetailsData;
  setData: (v: ViewDetailsData) => void;
}

export const ViewDetailsContext = createContext<ViewDetailsContextType>({
  details: false,
  setDetails: () => {},
  amount: 1,
  setAmount: () => {},
  id: "",
  setId: () => {},
  data: {
    img: "",
    title: "",
    size: "",
    description: "",
    category: "",
    material: "",
    colores: [],
  },
  setData: () => {},
});

export const ViewDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [details, setDetails] = useState(false);
  const [amount, setAmount] = useState(1);
  const [id, setId] = useState("");
  const [data, setData] = useState<ViewDetailsData>({
    img: "",
    title: "",
    size: "",
    description: "",
    category: "",
    material: "",
    colores: [],
  });

  return (
    <ViewDetailsContext.Provider
      value={{ details, setDetails, amount, setAmount, id, setId, data, setData }}
    >
      {children}
    </ViewDetailsContext.Provider>
  );
};
