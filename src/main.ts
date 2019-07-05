import "reflect-metadata";
import { AppManager } from "./service";
import {
  IApiFindRestRequest,
  IApiFindRestResponse,
  IApiFindRestResponseData,
  IApiFindRestResponseOneRest
} from "./interfaces";
import { createConnection } from "typeorm";

(async() => {
  await createConnection(AppManager.provideMysqlConnectionOptions());

  const fastify = require('fastify')({
    logger: true
  });
  const resolve = require('path').resolve;
  fastify.register(require('point-of-view'), {
    engine: {
      ejs: require('ejs')
    },
    templates: '/app/src/template',
  });


// Index Page Front
//---------------------------------------------------------------
  fastify.get('/', (req, reply) => {
    reply.view('index.ejs', { test: 'test111' })
  });

// API - PUT /findInCSV
//---------------------------------------------------------------
  fastify.put('/findInCSV', async (request, reply) => {

    const appManager = new AppManager();

    const requestData: IApiFindRestRequest = request.body;

    const date = new Date(requestData.datetime);
    const result = await appManager.findOpenRestaurants(date);

    const data: IApiFindRestResponseData = result.map((element) => {
      return {name: element.name, scheduleRAW: element.scheduleRAW}
    });

    const response: IApiFindRestResponse = {
      status: true,
      data: data
    };

    reply.type('application/json').code(200);
    return response;
  });

// API - PUT /findInDB
//---------------------------------------------------------------
  fastify.put('/findInDB', async (request, reply) => {

    const appManager = new AppManager();

    const requestData: IApiFindRestRequest = request.body;

    const date = new Date(requestData.datetime);
    const result = await appManager.findOpenRestaurantsInDB(date);

    const data: IApiFindRestResponseData = result.map((element) => {
      return {name: element.name, scheduleRAW: element.scheduleRAW}
    });

    const response: IApiFindRestResponse = {
      status: true,
      data: data
    };

    reply.type('application/json').code(200);
    return response;
  });

  fastify.listen(3000, '0.0.0.0', (error, address) => {
    if (error) {
      throw error;
    }
    fastify.log.info(`server listening on ${address}`)
  });

})();







