#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../stacks/network-stack';
import { DataStack } from '../stacks/data-stack';
import { EksStack } from '../stacks/eks-stack';
import { environments } from '../config';

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
};
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
});

// compute.addDependency(network);
