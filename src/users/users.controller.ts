import express, { Request, Response, NextFunction } from 'express';
import Joi, { string } from 'joi';
import { validateRequest } from '../_middleware/validate-request';
import { Role } from '../_helpers/role';
import { userService } from './user.service';

const router = express.Router();

// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

// Route functions
async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getById((req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.create(req.body);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.update((req.params.id), req.body);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
}

async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.delete((req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Validation Schemas
function createSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });
  validateRequest(req, res, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    title: Joi.string().allow(''),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    role: Joi.string().valid(Role.Admin, Role.User).allow(''),
    email: Joi.string().email().allow(''),
    username: Joi.string().min(3).max(30).allow(''),
    password: Joi.string().min(6).allow(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).allow(''),
  }).with('password', 'confirmPassword');
  validateRequest(req, res, next, schema);
}