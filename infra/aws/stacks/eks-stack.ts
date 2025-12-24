// import * as cdk from 'aws-cdk-lib';
// import * as eks from 'aws-cdk-lib/aws-eks';
// import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import { Construct } from 'constructs';
// import { EnvironmentConfig } from '../config';

// interface EksStackProps extends cdk.StackProps {
//   config: EnvironmentConfig;
//   vpc: ec2.IVpc;
// }

// export class EksStack extends cdk.Stack {
//   public readonly cluster: eks.Cluster;

//   constructor(scope: Construct, id: string, props: EksStackProps) {
//     super(scope, id, props);

//     this.cluster = new eks.Cluster(this, 'AppCluster', {
//       clusterName: `${props.config.name}-cluster`,
//       version: eks.KubernetesVersion.of(props.config.eks.version),
//       vpc: props.vpc,
//       defaultCapacity: 0, // We will manage managed node groups explicitly
//       vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
//       endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
//       kubectlLayer: '1.29',
//     });

//     this.cluster.addNodegroupCapacity('WorkerNodes', {
//       instanceTypes: props.config.eks.instanceTypes.map(
//         (t) => new ec2.InstanceType(t)
//       ),
//       minSize: props.config.eks.minSize,
//       maxSize: props.config.eks.maxSize,
//       amiType: eks.NodegroupAmiType.AL2_X86_64,
//     });

//     const albControllerPolicy = new iam.PolicyStatement({
//       effect: iam.Effect.ALLOW,
//       actions: [
//         'elasticloadbalancing:*',
//         'ec2:Describe*',
//         'ec2:AuthorizeSecurityGroupIngress',
//         'waf-regional:*',
//         'wafv2:*',
//         'shield:*',
//       ],
//       resources: ['*'],
//     });

//     const albServiceAccount = this.cluster.addServiceAccount(
//       'ALBServiceAccount',
//       {
//         name: 'aws-load-balancer-controller',
//         namespace: 'kube-system',
//       }
//     );
//     albServiceAccount.addToPrincipalPolicy(albControllerPolicy);

//     this.cluster.addHelmChart('RedisCache', {
//       chart: 'redis',
//       repository: 'https://charts.bitnami.com/bitnami',
//       namespace: 'database',
//       createNamespace: true,
//       values: {
//         architecture: 'standalone',
//         auth: { enabled: false }, // Demo only
//       },
//     });
//   }
// }
