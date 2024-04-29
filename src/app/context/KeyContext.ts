import { createContext, Dispatch } from "react";


interface IKeyContext {
  keys: any[];
  setKeys: Dispatch<any>;
}

export const KeyContext = createContext<IKeyContext>({
    keys: [],
    setKeys: () => {},
});
