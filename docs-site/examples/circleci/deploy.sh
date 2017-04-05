#!/bin/bash

# Exit on any error
set -e

# push the container we just built
sudo /opt/google-cloud-sdk/bin/gcloud docker -- push gcr.io/${GCLOUD_PROJECT_NAME}/prismatic-spray:$CIRCLE_SHA1
# make sure we can read our kubectl config, set up earlier in the build process
sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube

# if it came from master it's a prod build, otherwise it's dev
if [ $CIRCLE_BRANCH == "master" ]
then
    export TBN_STAGE=prod
else
    export TBN_STAGE=dev
fi

if [ -z "$CIRCLE_SHA1" ]
then
    export CIRCLE_SHA1=`git rev-parse HEAD`
    echo "CIRCLE_SHA1 unset, setting to $CIRCE_SHA1"
fi

if [ -z "$CIRCLE_BRANCH" ]
then
    export CIRCLE_BRANCH=`git rev-parse --abbrev-ref HEAD`
    echo "CIRCLE_BRANCH unset, setting to $CIRCE_BRANCH"
fi

export TBN_VERSION=`date +%F`-`echo $CIRCLE_SHA1 | cut -b 1-8`

echo "Circle branch is $CIRCLE_BRANCH, setting TBN_STAGE to $TBN_STAGE, TBN_VERSION to $TBN_VERSION"

# pipe our generated config file to stdout for inspection
echo "deploy file is "

cat deploy-template.yaml | sed "s~\$CIRCLE_SHA1~$CIRCLE_SHA1~; s~\$CIRCLE_BRANCH~$CIRCLE_BRANCH~; s~\$TBN_STAGE~$TBN_STAGE~; s~\$TBN_VERSION~$TBN_VERSION~; s~\$GCLOUD_PROJECT_NAME~$GCLOUD_PROJECT_NAME~"

# now pipe it to kubectl create
cat deploy-template.yaml | sed "s~\$CIRCLE_SHA1~$CIRCLE_SHA1~; s~\$CIRCLE_BRANCH~$CIRCLE_BRANCH~; s~\$TBN_STAGE~$TBN_STAGE~; s~\$TBN_VERSION~$TBN_VERSION~; s~\$GCLOUD_PROJECT_NAME~$GCLOUD_PROJECT_NAME~" | kubectl create -f -
