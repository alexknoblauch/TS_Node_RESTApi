import { UserCreateInput } from "@/models/user";
import { validateRequired } from "@/utils/validation/validateRequired";
import { NextFunction, Request } from "express";

const register = function (req: Request, res: Response, next: NextFunction) {
    const { userName, email, password, role } = req.body as UserCreateInput

    validateRequired(req, userName, 'Username')
    validateRequired(req, email, 'Email')
    validateRequired(req, password, 'Password')
    validateRequired(req, role, 'Role')

    
}