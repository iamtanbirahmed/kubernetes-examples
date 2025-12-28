export const EKS_CONFIG = {
  VERSION: '1.31',
} as const;
export interface EnvironmentConfig {
  name: 'staging' | 'demo' | 'prod';
  cidr: string;
  maxAzs: number;
  eks: {
    minSize: number;
    maxSize: number;
    instanceTypes: string[];
    version: string; // e.g., '1.28'
  };
  ecrRepos: string[]; // List of repo names to generate
  maxImageCount: number;
  projectName: string;
}

export const environments: Record<string, EnvironmentConfig> = {
  staging: {
    name: 'staging',
    cidr: '10.10.0.0/16',
    maxAzs: 0,
    eks: {
      minSize: 2,
      maxSize: 4,
      instanceTypes: ['t3.micro'],
      version: EKS_CONFIG.VERSION,
    },
    ecrRepos: ['command', 'query', 'worker'],
    maxImageCount: 1,
    projectName: 'k8-examples',
  },
  demo: {
    name: 'demo',
    cidr: '10.20.0.0/16',
    maxAzs: 2,
    eks: {
      minSize: 3,
      maxSize: 5,
      instanceTypes: ['t3.micro'],
      version: EKS_CONFIG.VERSION,
    },
    ecrRepos: ['command', 'query', 'worker'],
    maxImageCount: 1,
    projectName: 'k8-examples',
  },
  prod: {
    name: 'prod',
    cidr: '10.30.0.0/16',
    maxAzs: 3,
    eks: {
      minSize: 3,
      maxSize: 10,
      instanceTypes: ['t3.micro'],
      version: EKS_CONFIG.VERSION,
    },
    ecrRepos: ['auth-service', 'payment-service', 'frontend-app'],
    maxImageCount: 1,
    projectName: 'k8-examples',
  },
};
