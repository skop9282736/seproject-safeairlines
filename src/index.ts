import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import cors = require("cors");
import helmet = require("helmet");
import hbs  = require('express-handlebars');
import { join } from "path";


createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // Register '.mustache' extension with The Mustache Express
    app.set('view engine', 'hbs');
    app.engine( 'hbs', hbs( {
        extname: 'hbs',
        defaultView: 'default',
        layoutsDir:join( __dirname, '..', '/views/'),
        partialsDir: join(__dirname , '..', '/views/partials/')
      }));
    


    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(8082);

    console.log("Express server has started on port 8080. Open http://localhost:8080 to see results");

}).catch(error => console.log(error));
