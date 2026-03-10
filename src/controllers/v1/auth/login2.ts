import { LoginCredentials } from "@/models/user";
import authService from "@/services/auth.service";
import { Request } from "express";

const login = async function(req: Request, res: Response) {
    const  credentials  = req.body as LoginCredentials

    const accessToken = await authService.login(credentials)
}