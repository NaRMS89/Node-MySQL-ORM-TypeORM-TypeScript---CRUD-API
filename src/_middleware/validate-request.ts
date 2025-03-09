import { Request, Response, NextFunction } from "express";
import { Schema } from "joi"; 

export function validateRequest(req: Request, res: Response, next: NextFunction, schema: Schema): void {
    const options = {
        abortEarly: false, 
        allowUnknown: true, 
        stripUnknown: true, 
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
        return next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
    } else {
        req.body = value; 
        next();
    }
}