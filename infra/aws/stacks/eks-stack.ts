import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { KubectlV34Layer } from '@aws-cdk/lambda-layer-kubectl-v34';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config';
import LBPolicyJson from '../config/lb_policy';

interface EksStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
}

export class EksStack extends cdk.Stack {
  public readonly cluster: eks.Cluster;

  constructor(scope: Construct, id: string, props: EksStackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('Environment', props.config.name);
    cdk.Tags.of(this).add('Project', 'k8s-examples');

    this.cluster = new eks.Cluster(this, `${props.config.name}-k8s-examples`, {
      clusterName: `${props.config.name}-k8s-examples`,
      version: eks.KubernetesVersion.of(props.config.eks.version),
      kubectlLayer: new KubectlV34Layer(this, 'KubectlV34Layer'),
      vpc: props.vpc,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
      defaultCapacity: 0,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
      bootstrapClusterCreatorAdminPermissions: true
    });

    this.cluster.addNodegroupCapacity('WorkerNodes', {
      instanceTypes: props.config.eks.instanceTypes.map(
        (t) => new ec2.InstanceType(t)
      ),
      capacityType: eks.CapacityType.SPOT,
      subnets: { subnetType: ec2.SubnetType.PUBLIC },
      minSize: props.config.eks.minSize,
      maxSize: props.config.eks.maxSize,
      amiType: eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
    });

    const lbPolicy = new iam.ManagedPolicy(this, 'LBCPolicy', {
      managedPolicyName: 'AWSLoadBalancerControllerIAMPolicy',
      document: iam.PolicyDocument.fromJson(LBPolicyJson),
    });

    // IAM Service Account for AWS Load Balancer Controller
    const sa = this.cluster.addServiceAccount('aws-load-balancer-controller', {
      name: 'aws-load-balancer-controller',
      namespace: 'kube-system',
    });

    sa.role.addManagedPolicy(lbPolicy);

    this.cluster.addHelmChart('ALBController', {
      chart: 'aws-load-balancer-controller',
      repository: 'https://aws.github.io/eks-charts',
      namespace: 'kube-system',
      release: 'aws-load-balancer-controller',
      version: '1.14.0',
      values: {
        clusterName: this.cluster.clusterName,
        serviceAccount: {
          create: false, // Use the one we created in step 4
          name: sa.serviceAccountName,
        },
        region: this.region,
        vpcId: props.vpc.vpcId,
      },
    });
  }
}
