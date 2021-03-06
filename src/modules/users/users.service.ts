import { Inject, Injectable } from '@nestjs/common';
import { ArangoDbRepository } from 'src/arangodb/arangodb.repository';
import { ArangoDbService } from 'src/arangodb/arangodb.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly bcrypt: BcryptService,
  ) {}

  findAll() {
    return this.userRepo.findAll();
  }

  findById(id: string) {
    return this.userRepo.findById(id);
  }

  async findByUsername(username: string) {
    return await this.userRepo.findByUsername(username);
  }


  async create(obj: Object) {
    obj['password'] = await this.bcrypt.hash(obj['password']);

    const user = await this.userRepo.save(obj);
    const roles = await this.userRepo.saveUserRole(user, {
      _username: user.username,
      roles: ['COMUN'],
    });
    user['roles'] = roles.roles;
    return user;
  }

  update(id: string, obj: Object) {
    return this.userRepo.update(id, obj);
  }

  delete(id: string) {
    return this.userRepo.delete(id);
  }
}
