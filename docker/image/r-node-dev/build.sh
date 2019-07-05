#!/bin/bash

# DOCKER HUB Registry
##-------------------------------
VERSION=0.0.1
docker build -t breitsmiley/upw-rest-dev:latest -t breitsmiley/upw-rest-dev:${VERSION} . \
&& docker push breitsmiley/upw-rest-dev:latest \
&& docker push breitsmiley/upw-rest-dev:${VERSION}
