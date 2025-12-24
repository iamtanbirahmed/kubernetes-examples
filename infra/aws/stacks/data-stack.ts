import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config';

interface DataStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class DataStack extends cdk.Stack {
  public readonly chartBucket: s3.Bucket;
  public readonly repositories: ecr.Repository[] = [];

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    // 1. S3 Bucket for Helm Charts
    this.chartBucket = new s3.Bucket(this, 'HelmChartBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // removalPolicy:
      //   props.config.name === 'prod'
      //     ? cdk.RemovalPolicy.RETAIN
      //     : cdk.RemovalPolicy.DESTROY,
      // autoDeleteObjects: props.config.name !== 'prod',
      autoDeleteObjects: true,
    });

    // 2. Dynamic ECR Repositories from Config List
    // props.config.ecrRepos.forEach((repoName) => {
    //   const repo = new ecr.Repository(this, `Repo-${repoName}`, {
    //     repositoryName: `${props.config.name}-${repoName}`,
    //     imageScanOnPush: true,
    //     removalPolicy:
    //       props.config.name === 'prod'
    //         ? cdk.RemovalPolicy.RETAIN
    //         : cdk.RemovalPolicy.DESTROY,
    //     emptyOnDelete: props.config.name !== 'prod',
    //     lifecycleRules: [
    //       {
    //         maxImageCount: 50, // Cost saving: keep only last 50 images
    //         description: 'Keep last 50 images',
    //       },
    //     ],
    //   });
    //   this.repositories.push(repo);
    // });
  }
}
