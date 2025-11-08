import type React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  // FIX: Changed icon type to be a more specific React.ReactElement for better type safety with React.cloneElement.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  component: React.ComponentType;
}

export enum UnitType {
  Length = 'Length',
  Weight = 'Weight',
  Temperature = 'Temperature',
}
