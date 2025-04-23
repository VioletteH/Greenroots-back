import type { Request, Response } from "express";
import sanitizer from "sanitizer";
import { searchMapper } from "../mappers/searchMapper";

export const searchController = async (req:Request, res:Response): Promise<void> => {
    const query = req.query.search as string;
    if(!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    // Sanitize the input
    const sanitizedQuery = sanitizer.sanitize(query);

    // Perform search
    const searchResults = await searchMapper(sanitizedQuery);

    if (searchResults.length === 0) {
        res.status(404).json("No results found");
        return;
    }
    res.status(200).json(searchResults);
}