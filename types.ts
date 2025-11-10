import type React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  component: React.ComponentType;
}

export enum UnitType {
  Length = 'Length',
  Weight = 'Weight',
  Temperature = 'Temperature',
}
