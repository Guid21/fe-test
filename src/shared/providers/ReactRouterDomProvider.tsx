import React from 'react';
import { BrowserRouter } from 'react-router-dom';

function ReactRouterDomProvider({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

export default ReactRouterDomProvider;
