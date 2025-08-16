import express from 'express'
// import {getAllExceptions, getExceptionEntry, updateException}  from '../controller/ctrException'
// import {auditLog} from '../controller/auditLog';
import { cGetAllProducts, cGetProduct } from './product.controller';

export const productRouter = express.Router();

//CTR-exception Table
productRouter.get('/getAllProducts', cGetAllProducts);
productRouter.get('/getProduct/:id', cGetProduct);
