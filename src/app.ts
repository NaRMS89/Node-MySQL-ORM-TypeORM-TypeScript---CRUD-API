import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import 'reflect-metadata';
import { errorHandler } from "./_middleware/error-handler";
import usersController from './users/users.controller'; 

dotenv.config(); 

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000; 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(errorHandler);

app.use('/users', usersController); 

app.listen(port, () => {
    console.log(` Server is running on port ${port}`);
});