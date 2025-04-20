// Utility to check if the route is a lab-owner route
export const isLabOwnerRoute = (pathname: string): boolean => {
  return pathname.startsWith("/lab-owner") || pathname === "/lab-dashboard";
};
