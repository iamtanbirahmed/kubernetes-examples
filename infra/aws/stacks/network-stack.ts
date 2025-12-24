import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config';

interface NetworkStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);
    const envPrefix = props.config.name.toUpperCase();

    cdk.Tags.of(this).add('Environment', envPrefix);
    cdk.Tags.of(this).add('Project', `k8-examples`);

    this.vpc = new ec2.Vpc(this, 'EksVpc', {
      vpcName: `${envPrefix}-vpc`,
      ipAddresses: ec2.IpAddresses.cidr(props.config.cidr),
      maxAzs: props.config.maxAzs,
      natGateways: props.config.maxAzs,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // Tagging for K8s AWS Load Balancer Controller discovery
    this.vpc.publicSubnets.forEach((subnet) => {
      cdk.Tags.of(subnet).add('kubernetes.io/role/elb', '1');
    });
    this.vpc.privateSubnets.forEach((subnet) => {
      cdk.Tags.of(subnet).add('kubernetes.io/role/internal-elb', '1');
    });
  }
}
