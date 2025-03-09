import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; 
import { db } from '../_helpers/db';
import { User } from '../users/user.model';
import { Repository } from 'typeorm';

const userRepository: Repository<User> = db.getRepository(User);

export const userService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(): Promise<User[]> {
  return await userRepository.find();
}

async function getById(id: string): Promise<User> {  
  return await getUser(id);
}

interface CreateUserParams {
  email: string;
  password: string;
  username?: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
}

async function create(params: CreateUserParams): Promise<void> {
  // Check if email already exists
  if (await userRepository.findOne({ where: { email: params.email } })) {
    throw new Error(`Email "${params.email}" is already registered`);
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(params.password, salt);

  // Create new user
  const user = userRepository.create({
    id: uuidv4(),  // Generate UUID v4 for ID
    ...params,
    passwordHash: hashedPassword, // Store hashed password
  });

  await userRepository.save(user);
}

async function update(id: string, params: Partial<CreateUserParams>): Promise<void> {
  const user = await getUser(id);

  const usernameChanged = params.username && user.username !== params.username;
  if (usernameChanged && await userRepository.findOne({ where: { username: params.username } })) {
    throw new Error(`Username "${params.username}" is already taken`);
  }

  // Hash new password if provided
  if (params.password) {
    const salt = await bcrypt.genSalt(10);
    params.password = await bcrypt.hash(params.password, salt);
  }

  Object.assign(user, params);
  await userRepository.save(user);
}

async function _delete(id: string): Promise<void> {
  const user = await getUser(id);
  await userRepository.remove(user);
}

async function getUser(id: string): Promise<User> {
  const user = await userRepository.findOne({ where: { id } });
  if (!user) throw new Error('User not found');
  return user;
}