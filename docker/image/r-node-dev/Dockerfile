ARG NODE_VERSION=12.5.0

FROM node:${NODE_VERSION}-alpine

#ARG NPM_VERSION=6.0.1
#ARG NEST_CLI_VERSION=5.7.1

# GIT
RUN apk --no-cache add git

#Copy Entry point
COPY entrypoint-app.sh /usr/local/bin/entrypoint-app
RUN chmod +x /usr/local/bin/entrypoint-app

# Create app directory
WORKDIR /app
ENV PATH node_modules/.bin:$PATH

ENTRYPOINT ["entrypoint-app"]
CMD [ "ping", "127.0.0.1" ]
