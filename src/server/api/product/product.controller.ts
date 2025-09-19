// api/users/users.controller.js
import { Request, Response, NextFunction } from "express";
import {getAllProducts, getProduct} from '../../services/product.service'
import { UUID } from "crypto";
// This is the function that Express will execute for the POST /api/users route.
export const cGetAllProducts = async (req: Request, res: Response, next: NextFunction) => {
 let result
    try {
     result =  await getAllProducts()

    
  if (result){
    res.status(200).json({result:result,status:true} )
  } else {
    res.status(200).send({ status: false, result: 'error' }); //need editing
  }

  } catch (error) {
    console.log('error', error)
    res.status(500).send({ status: false, result: error }); //need editing

    // next(error);
  }
};
export const cGetProduct = async (req: Request, res: Response, next: NextFunction) =>{
  let result
    try {
      const id = req.params['id'] as UUID
     result =  await getProduct(id)

    
  if (result!){
    res.status(200).json({result:result,status:true} )
  } else {
    res.status(200).send({ status: false, result: 'error in cGetProduct' }); //need editing
  }

  } catch (error) {
    console.log('error', error)
    res.status(500).send({ status: false, result: error }); //need editing

    // next(error);
  }
}
