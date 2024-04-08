import { createContext, Dispatch } from "react";


interface IDomainsContext {
  domains: any[];
  setDomains: Dispatch<any>;
}

export const DomainsContext = createContext<IDomainsContext>({
    domains: [],
    setDomains: () => {},
});
