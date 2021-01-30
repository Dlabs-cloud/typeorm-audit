import { Connection, EntityManager } from "typeorm";
import { ActivityLog } from "../data/entity/ActivityLog";

export class EntityManagerFactory {

    constructor(private connection: Connection) { }

    async forActivity<E>(activity: ActivityLog, operation: (entityManager: EntityManager) => Promise<E>) {
        this.connection['taskActivity'] = activity;
        const val = await operation(this.connection.manager);
        this.connection['taskActivity'] = undefined;
        return val;
    }
}