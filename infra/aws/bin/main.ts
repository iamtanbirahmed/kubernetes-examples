#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { environments } from '../config';
import { DataStack } from '../stacks/data-stack';
import { EksStack } from '../stacks/eks-stack';
import { NetworkStack } from '../stacks/network-stack';

const app = new cdk.App();
const envName = app.node.tryGetContext('ENV') as string;

if (!envName || !environments[envName]) {
  throw new Error(
    `Please provide a valid environment context: -c env=[staging|demo|prod]`
  );
}

const config = environments[envName];
const envAWS = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
  principal: process.env.AWS_PRINCIPAL_ARN,
};

Object.entries(envAWS).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`CRITICAL: Environment variable for ${key} is missing. 
    Make sure you have set it in your shell or GitHub Secrets.`);
  }
});

const envPrefix = config.name.toUpperCase();

const data = new DataStack(app, `${envPrefix}-DataStack`, {
  env: envAWS,
  config,
});

const network = new NetworkStack(app, `${envPrefix}-NetworkStack`, {
  env: envAWS,
  config,
});

const compute = new EksStack(app, `${envPrefix}-EksStack`, {
  env: envAWS,
  config,
  vpc: network.vpc,
  principal: envAWS.principal,
});

compute.addDependency(data);
compute.addDependency(network);
