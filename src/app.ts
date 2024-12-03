import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import { morgan } from './modules/logger';
import { jwtStrategy } from './modules/auth';
import { authLimiter } from './modules/utils';
import { ApiError, errorConverter, errorHandler } from './modules/errors';
import routes from './routes/v1';
//
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  return res.send('Added iot mail');
});

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors

const corsOptions = {
  origin: ['https://iotlab.tech', 'https://timetracker.gizantech.com','http://localhost:3002/', 'http://localhost:3001/', 'http://localhost:3000/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors());
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
  next();
});


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
