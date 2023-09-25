

import express from "express";
import { json } from "express";
import ownersRouter from './owners.js'
import restaurant from './restaurant.js'
const server = express();

server.use(json());

server.use("/api/owners", ownersRouter);
server.use("/api/restaurant", restaurant);

export default server;
