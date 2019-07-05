#!/bin/bash

# DOCKER HUB Registry
##-------------------------------
VERSION=0.0.1
docker build -t breitsmiley/upw-rest-preprod:latest -t breitsmiley/upw-rest-preprod:${VERSION} . \
&& docker push breitsmiley/upw-rest-preprod:latest \
&& docker push breitsmiley/upw-rest-preprod:${VERSION}
