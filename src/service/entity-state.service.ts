import { InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { OperationType } from "../data/enum/operation-type.enum";
import { AuditPersistenceService } from "./audit-persistence.service";
import { ActivityLog } from "../data/entity/ActivityLog";
import { CodeContext } from "../data/entity/CodeContext";
import { EntityState } from "../data/entity/EntityState";
import { EntityStateAttribute } from "../data/entity/EntityStateAttribute";
import { TransactionLog } from "../data/entity/TransactionLog";
import { WebRequest } from "../data/entity/WebRequest";

export class EntityStateService {

    constructor(private auditPersistenceService: AuditPersistenceService) { }

    async createEntityState(event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>, operationType: OperationType, id?: any) {
        const entityState: EntityState = new EntityState();
        entityState.operationType = operationType;
        entityState.entityName = event.metadata.name;
        entityState.entityId = JSON.stringify(id || event.manager.getId(event.entity));

        const taskTransaction: TransactionLog = event.queryRunner.data.taskTransaction;
        if (!taskTransaction.id) {
            await this.auditPersistenceService.persistTaskTransaction(taskTransaction, event.manager);
        }
        entityState.taskTransaction = taskTransaction;
        await event.manager.save(entityState);
        return entityState;
    }

    isAuditEntity(event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>) {
        const classes: Array<Function | string> = [
            WebRequest,
            ActivityLog,
            TransactionLog,
            CodeContext,
            EntityState,
            EntityStateAttribute
        ];
        return classes.includes(event.metadata.target);
    }
}