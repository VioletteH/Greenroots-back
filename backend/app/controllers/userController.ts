import { Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { User } from '../types/index';

const userMapper = new BaseMapper<User>('user');

const userController = {   

    users: async (req:Request, res:Response) => {
        const users = await userMapper.findAll();
        res.json(users);
    },
    userById: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const user = await userMapper.findById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send(`Utilisateur avec l'ID ${id} non trouvé`);
        }
    },
    addUser: async (req:Request, res:Response) => {
        const newUserData = req.body; 
        const newUser = await userMapper.create(newUserData);
        res.status(201).json(newUser);
    },
    updateUser: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const updatedUserData = req.body; 
        const updatedUser = await userMapper.update(id, updatedUserData);
        res.json(updatedUser);
    }
    ,
    deleteUser: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const deletedUser = await userMapper.delete(id);
        res.send("Utilisateur supprimé");
    }
}
export default userController;