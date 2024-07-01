#!/usr/bin/env bash
set -e

if [ -z "${SERVER_PORT}" ]; then
    log  "ERROR: Please set environment variable SERVER_PORT for Application Port.";
    exit 1;
fi

if [ -z "${EC2_SPOT_PRICE}" ]; then
    log  "ERROR: Please set environment variable EC2_SPOT_PRICE for ec2 spot price.";
    exit 1;
fi

export APPLICATION_VERSION=${CIRCLE_TAG}
export RDS_NAME="${CIRCLE_PROJECT_REPONAME}-${EB_ENVIRONMENT}"

log "define ssm keys"
export DB_USER_CONFIG_KEY="/${CIRCLE_PROJECT_REPONAME}/${EB_ENVIRONMENT}/dbuser"
export DB_PASSWORD_CONFIG_KEY="/${CIRCLE_PROJECT_REPONAME}/${EB_ENVIRONMENT}/dbpassword"
export URL_IDENTITY_SERVICE_CONFIG_KEY="/${CIRCLE_PROJECT_REPONAME}/${EB_ENVIRONMENT}/url_identity_service"
export URL_TENANCY_SERVICE_CONFIG_KEY="/${CIRCLE_PROJECT_REPONAME}/${EB_ENVIRONMENT}/url_tenancy_service"
export URL_TEMPLATE_ENGINE_SERVICE_CONFIG_KEY="/${CIRCLE_PROJECT_REPONAME}/${EB_ENVIRONMENT}/url_template_engine"

log "Fetching the RDS Endpoint using aws cli."
export DB_HOST=$(aws rds describe-db-instances --query 'DBInstances[*].[Endpoint.Address]' --db-instance-identifier "${RDS_NAME}" --output text);

log "Fetching the RDS Username using aws ssm parameter store."
export DB_USERNAME=$(aws ssm get-parameter --name "${DB_USER_CONFIG_KEY}" --region "${AWS_DEFAULT_REGION}" --query Parameter.Value --output text);

log "Fetching the RDS Password using aws ssm parameter store."
export DB_PASSWORD=$(aws ssm get-parameter --name "${DB_PASSWORD_CONFIG_KEY}" --region "${AWS_DEFAULT_REGION}" --query Parameter.Value --output text);

log "Fetching the URL_IDENTITY_SERVICE Key using aws ssm parameter store."
export URL_IDENTITY_SERVICE=$(aws ssm get-parameter --name "${URL_IDENTITY_SERVICE_CONFIG_KEY}" --region "${AWS_DEFAULT_REGION}" --query Parameter.Value --output text);

log "Fetching the URL_TENANCY_SERVICE Key using aws ssm parameter store."
export URL_TENANCY_SERVICE=$(aws ssm get-parameter --name "${URL_TENANCY_SERVICE_CONFIG_KEY}" --region "${AWS_DEFAULT_REGION}" --query Parameter.Value --output text);

log "Fetching the URL_TEMPLATE_ENGINE_SERVICE Key using aws ssm parameter store"
export URL_TEMPLATE_ENGINE_SERVICE=$(aws ssm get-parameter --name "${URL_TEMPLATE_ENGINE_SERVICE_CONFIG_KEY}" --region "${AWS_DEFAULT_REGION}" --query Parameter.Value --output text);
