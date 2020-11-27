import { getConnection } from 'typeorm';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { SaveOptions } from 'typeorm/repository/SaveOptions';

export class BaseRepository {

    public async exists<T>(item: T): Promise<boolean> {

        return !!await this.getManager().findOne(item.constructor, {
            where: [ item ]
        });
    }

    save<Entity>(entity: Entity, options?: SaveOptions): Promise<Entity> {
        return this.getManager().save(entity, options);
    }

    getManager(): EntityManager {
        return getConnection().manager;
    }
}

export default new BaseRepository();
