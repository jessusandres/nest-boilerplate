#!/bin/bash

# Cloud function current main
   function creatingCloudFunctionMain() {
       
      echo "Deploying cloud function Current Data"
      echo "===================================================================="
      gcloud functions deploy ${CI_PROJECT_TITLE}-${ENVIRONMENT} \
      --gen2 \
      --project=${PROJECT_ID} \
      --region=${REGION} \
      --runtime=${RUNTIME} \
      --trigger-http \
      --entry-point=${ENTRY_POINT} \
      --source=. \
      --service-account=${SA_EMAIL_NAME}@${PROJECT_ID}.iam.gserviceaccount.com \
      --memory=${MEMORY} \
      --timeout=${TIMEOUT} \
      --set-env-vars=PROJECT_ID="${PROJECT_ID}" \
      --verbosity=${DEBUG_MODE} \
      --vpc-connector=${VPC_CONNECTOR}

      GCLOUD_RETURNCODE=$?
      if [ $GCLOUD_RETURNCODE -ne 0 ]
      then
        echo "Error occurred with gcloud"
        exit 1
      fi

      echo ""
  }





 function creatingCloudSchedulerMain() {

      echo $GCF_SERVICES_ACCOUNT_KEY | base64 -d > serviceaccount.json
      gcloud auth activate-service-account --key-file serviceaccount.json
      export PROJECT_NAME=$PROJECT_ID
      gcloud config set project ${PROJECT_NAME}
      export URL_CF=$(gcloud functions describe ${CI_PROJECT_TITLE}-${ENVIRONMENT} \
                    --region=${REGION} \
                    --format="value(serviceConfig.uri)")
    
      echo "Creating cloud scheduler"
      echo "===================================================================="
      export VALIDATOR=$(gcloud scheduler jobs list --location ${REGION} | grep ${CI_PROJECT_TITLE}-${ENVIRONMENT} | cut -d ' ' -f1)
      if [ ! -z "$VALIDATOR" ]; then
        gcloud scheduler jobs update http ${CI_PROJECT_TITLE}-${ENVIRONMENT} \
        --location ${REGION} \
        --schedule "$CRONJOB" \
        --time-zone "$TIME_ZONE" \
        --http-method GET \
        --uri="$URL_CF" \
        --max-retry-attempts 3 \
        --oidc-service-account-email ${SA_EMAIL_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
      else
        gcloud scheduler jobs create http ${CI_PROJECT_TITLE}-${ENVIRONMENT} \
        --location ${REGION} \
        --schedule "$CRONJOB" \
        --time-zone "$TIME_ZONE" \
        --http-method GET \
        --uri="$URL_CF" \
        --max-retry-attempts 3 \
        --oidc-service-account-email ${SA_EMAIL_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
      fi
  }


 
# Print setted environment variables (current)
function printEnvDataOp() {

    echo "Running for current with this environment variables"
    echo "===================================================================="

    echo "GCP Project Name: $PROJECT_ID"
    echo "Depployment Environment: $deployment_env"
    echo "Service Account EmailID: ${SA_EMAIL_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
    echo "Cloud Function Name: ${CI_PROJECT_TITLE}-${ENVIRONMENT}"
    echo "Region: $REGION"
    echo "CRONJOB: $CRONJOB"

    echo ""

}

function createPem() {
    echo "======================================="
    echo "Creando pem"
    echo "======================================="
    echo $CLIENT_KEY | base64 -d  > client-key.key
    echo $CLIENT_CRT | base64 -d  > client-cert.crt
    echo $SERVER_CA | base64 -d > server-ca.crt
    #chmod 0640 client-key.key
    #ls -ltr
    echo "======================================="
    echo "Fin"
    echo "======================================="
}


# Run Hourly Pacifico
function runCFDeploy() {

    printEnvDataOp
    #createPem
    creatingCloudFunctionMain
    #  Cloud Scheduler function
    #creatingCloudSchedulerMain

}


#  DEPLOY CLOUD FUNCTION - MULTIPLE PLANTS
#  Note : Enable / Disable corresponding function based on changes.
function runBulkCFDeploy() {

    echo "Starting deployment of multiple cloud functions"
    echo "===================================================================="
    echo ""

    runCFDeploy

}

if [ "$CI_COMMIT_BRANCH" == "develop" ]; then

    environment="DEVELOPMENT"
    echo "===================================================================="
    echo "Deployment for $environment environment from $CI_COMMIT_BRANCH branch"
    echo "===================================================================="
    echo ""

    # Load environment variables as per each Plant
    # export ENV_FILE=dev.env
    # RunBucket CloudFunction Deployment
    runBulkCFDeploy

elif [ "$CI_COMMIT_BRANCH" == "stage" ]; then

    environment="STAGE"
    echo "===================================================================="
    echo "Deployment for $environment environment from $CI_COMMIT_BRANCH branch"
    echo "===================================================================="
    echo ""

    # Load environment variables as per each Plant
    #export ENV_FILE=prod.env
    # RunBucket CloudFunction Deployment
    runBulkCFDeploy

elif [ "$CI_COMMIT_BRANCH" == "master" ]; then

    environment="PRODUCTION"
    echo "===================================================================="
    echo "Deployment for $environment environment from $CI_COMMIT_BRANCH branch"
    echo "===================================================================="
    echo ""

    # Load environment variables as per each Plant
    #export ENV_FILE=prod.env
    # RunBucket CloudFunction Deployment
    runBulkCFDeploy

else
    echo "I run Deployment only on develop and master branch"
    exit 1
fi
