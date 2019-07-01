ARG NODE_VERSION=12.5.0


### STAGE 1: Building project ###
#-----------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder

## Create app directory
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run prestart:prod


## STAGE 2: Setup main image ###
#-----------------------------------------------------
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

#Copy Entry point
COPY --from=builder /app/docker/image/r-node-preprod/entrypoint-app.sh /usr/local/bin/entrypoint-app
RUN chmod +x /usr/local/bin/entrypoint-app

# Copy dependency definitions
COPY --from=builder /app/node_modules ./node_modules
ENV PATH node_modules/.bin:$PATH

COPY --from=builder /app/package.json ./package.json

# Copy compiled sources
COPY --from=builder /app/dist ./

COPY --from=builder /app/src/db/rest_hours.csv /app/src/db/rest_hours.csv
COPY --from=builder /app/src/template/index.ejs /app/src/template/index.ejs

# Expose the port the app runs in
EXPOSE 3000

ENTRYPOINT ["entrypoint-app"]

# Serve the app
CMD ["node", "src/main.js"]
