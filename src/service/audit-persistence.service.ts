import { EntityManager } from "typeorm";
import { ActivityLog } from "../data/entity/ActivityLog";
import { TransactionLog } from "../data/entity/TransactionLog";

export class AuditPersistenceService {

    async persistTaskTransaction(taskTransaction: TransactionLog, entityManager: EntityManager) {
        if (!taskTransaction.taskActivity.id) {
            await this.persistTaskActivity(taskTransaction.taskActivity, entityManager);
        }

        await entityManager.save(taskTransaction);
    }

    async persistTaskActivity(taskActivity: ActivityLog, entityManager: EntityManager) {
        if (taskActivity.id) {
            const existing = await entityManager.findOne(ActivityLog, taskActivity.id);
            if (existing) {
                await entityManager.save(taskActivity);
                return;
            }
            delete taskActivity.id;
        }
        await entityManager.save(taskActivity);
    }

}