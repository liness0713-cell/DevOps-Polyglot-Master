import { CategoryDef } from './types';

export const CATEGORIES: CategoryDef[] = [
  {
    title: "Public Cloud (公有云)",
    topics: [
      { id: "aws", name: "AWS" },
      { id: "azure", name: "Azure" },
      { id: "finops", name: "FinOps" }
    ]
  },
  {
    title: "Containers & Orchestration (容器与编排)",
    topics: [
      { id: "docker", name: "Docker" },
      { id: "kubernetes", name: "Kubernetes" },
      { id: "eks", name: "EKS" },
      { id: "aks", name: "AKS" }
    ]
  },
  {
    title: "Middleware (中间件)",
    topics: [
      { id: "elasticsearch", name: "Elasticsearch" },
      { id: "redis", name: "Redis" },
      { id: "kafka", name: "Kafka" },
      { id: "zookeeper", name: "Zookeeper" },
      { id: "elk", name: "ELK Stack" }
    ]
  },
  {
    title: "Observability (监控与可观测性)",
    topics: [
      { id: "prometheus", name: "Prometheus" },
      { id: "grafana", name: "Grafana" },
      { id: "cloudwatch", name: "CloudWatch" },
      { id: "metrics", name: "Metrics Concepts" },
      { id: "logs", name: "Logging Strategies" },
      { id: "tracing", name: "Distributed Tracing" }
    ]
  },
  {
    title: "Security & Automation (安全与自动化)",
    topics: [
      { id: "iam", name: "IAM" },
      { id: "waf", name: "WAF" },
      { id: "terraform", name: "Terraform" },
      { id: "ansible", name: "Ansible" },
      { id: "cicd", name: "CI/CD Pipelines" }
    ]
  }
];
