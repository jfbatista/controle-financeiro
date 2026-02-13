import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddUserDto } from './dto/add-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createFirstUser(dto: CreateUserDto): Promise<any>;
    findAll(req: any): Promise<any>;
    addUser(req: any, dto: AddUserDto): Promise<any>;
    removeUser(req: any, id: number): Promise<any>;
    updateUserGroup(req: any, id: number, body: {
        groupId: number;
    }): Promise<any>;
}
