import { createContext, useContext, useState, ReactNode } from 'react';

type RouteContextType = {
  currentRoute: string;
  navigate: (route: string) => void;
  params: Record<string, string>;
};

const RouteContext = createContext<RouteContextType | null>(null);

export function useRouter() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
}

interface RouterProps {
  children: ReactNode;
}

export function Router({ children }: RouterProps) {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = (route: string) => {
    // Parse parameters from route (e.g., /product/123 -> { id: '123' })
    const routeParts = route.split('/');
    const newParams: Record<string, string> = {};
    
    if (routeParts[1] === 'product' && routeParts[2]) {
      newParams.id = routeParts[2];
    }
    
    setParams(newParams);
    setCurrentRoute(route);
  };

  return (
    <RouteContext.Provider value={{ currentRoute, navigate, params }}>
      {children}
    </RouteContext.Provider>
  );
}

interface RouteProps {
  path: string;
  children: ReactNode;
}

export function Route({ path, children }: RouteProps) {
  const { currentRoute } = useRouter();
  
  // Handle dynamic routes like /product/:id
  if (path.includes(':')) {
    const pathParts = path.split('/');
    const routeParts = currentRoute.split('/');
    
    if (pathParts.length !== routeParts.length) return null;
    
    for (let i = 0; i < pathParts.length; i++) {
      if (!pathParts[i].startsWith(':') && pathParts[i] !== routeParts[i]) {
        return null;
      }
    }
    
    return <>{children}</>;
  }
  
  return currentRoute === path ? <>{children}</> : null;
}