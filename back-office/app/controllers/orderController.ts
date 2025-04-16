import { Request, Response } from 'express';
import { getAllTrees, updateTree, deleteTree, addTree } from '../api/tree';
import { Tree } from '../types/index';