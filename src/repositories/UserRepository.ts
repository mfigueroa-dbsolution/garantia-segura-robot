import { BaseRepository } from './BaseRepository';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { User } from '../entities/User';

class UserRepository extends BaseRepository {

    public findAll(options: FindManyOptions<User> = {}): Promise<User[]> {

        return this.getManager().find(User, Object.assign(options));
    }

}

export default new UserRepository();
