import express from 'express'
import { NextFunction, Request, Response } from 'express';
import {productRouter} from './api/product/product.routes'


export const apiRoute = express.Router();

apiRoute.use('/products', productRouter)
