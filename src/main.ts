import { AppManager } from "./service/AppManager";
import { IApiFindRestRequestData } from "./interfaces";

const appManager = new AppManager();

const fastify = require('fastify')({
  logger: true
});

// API - PUT /findInCSV
//---------------------------------------------------------------
fastify.put('/findInCSV', async (request, reply) => {

  const requestData: IApiFindRestRequestData = request.body;

  const date = new Date(requestData.datetime);
  const result = await appManager.findOpenRestaurants(date);

  reply.type('application/json').code(200);
  return result;
});

// API - PUT /findInDB
//---------------------------------------------------------------
fastify.put('/findInDB', async (request, reply) => {

  const requestData: IApiFindRestRequestData = request.body;

  const date = new Date(requestData.datetime);
  const result = await appManager.findOpenRestaurantsInDB(date);

  reply.type('application/json').code(200);
  return result;
});

fastify.listen(3000, '0.0.0.0', (error, address) => {
  if (error) {
    throw error;
  }
  fastify.log.info(`server listening on ${address}`)
});







