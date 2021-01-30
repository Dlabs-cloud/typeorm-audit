import { ChronoUnit, Instant, OffsetDateTime } from '@js-joda/core';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { TransactionCommitEvent } from "typeorm/subscriber/event/TransactionCommitEvent";
import { TransactionStartEvent } from "typeorm/subscriber/event/TransactionStartEvent";
import { OperationType } from "../enum/operation-type.enum";
import { AuditPersistenceService } from "../../service/audit-persistence.service";
import { EntityStateService } from '../../service/entity-state.service';
import { ActivityLog } from "../entity/ActivityLog";
import { EntityState } from "../entity/EntityState";
import { EntityStateAttribute } from "../entity/EntityStateAttribute";
import { TransactionLog } from "../entity/TransactionLog";

@EventSubscriber()
export class PersistenceSubscriber implements EntitySubscriberInterface {

    auditPersistenceService = new AuditPersistenceService();
    entityStateService = new EntityStateService(this.auditPersistenceService);

    /**
     * Called before transaction start.
     */
    beforeTransactionStart(event: TransactionStartEvent) {
        // console.log(`BEFORE TRANSACTION STARTED: `);
        const taskActivity: ActivityLog = event.connection['taskActivity'];
        if (!taskActivity) {
            return;
        }
        const taskTransaction = new TransactionLog();
        taskTransaction.taskActivity = taskActivity;
        event.queryRunner.data.taskTransaction = taskTransaction;
    }

    /**
     * Called before transaction commit.
     */
    async beforeTransactionCommit(event: TransactionCommitEvent) {
        // console.log(`BEFORE TRANSACTION COMMITTED: `, event);
        const taskTransaction: TransactionLog = event.queryRunner.data.taskTransaction;
        if (!taskTransaction) {
            return;
        }
        taskTransaction.duration.nanoSecondsTaken = Instant.ofEpochMilli(taskTransaction.duration.startedAt.getTime()).until(
            OffsetDateTime.now(), ChronoUnit.NANOS);
        await event.manager.save(taskTransaction);
        // console.log(`BEFORE TRANSACTION COMMITTED: `, event.queryRunner.data.taskTransaction);
    }

    /**
     * Called after entity insertion.
     */
    async afterInsert(event: InsertEvent<any>) {
        if (this.entityStateService.isAuditEntity(event)) {
            return;
        }
        const entityState: EntityState = await this.entityStateService.createEntityState(event, OperationType.CREATE);

        const entity = event.entity;

        Promise.all(event.metadata.columns.map(async column => {

            const attribute = new EntityStateAttribute();
            attribute.entityState = entityState;
            attribute.name = column.propertyPath;

            if (event.metadata.relations
                .map(it => it.joinColumns)
                .reduce((a, b) => a.concat(b), [])
                .includes(column)) {
                if (!column.relationMetadata.isOwning) {
                    return;
                }

                const value = column.getEntityValue(entity);
                attribute.newValue = value && JSON.stringify(value);
                // console.log('relation', attribute.name, attribute.newValue);
            } else {
                attribute.newValue = column.getEntityValue(entity);
                // console.log('basic|embedded', attribute.name, attribute.newValue);
            }

            attribute.hasNewValue = !!attribute.newValue;
            attribute.hasPreviousValue = false;
            attribute.modified = true;

            await event.manager.save(attribute);
            // console.log(attribute);
        }));
        // console.log(`AFTER ENTITY INSERTED: `, event.entity);
        // console.log(event.metadata.ownColumns, event.metadata.ownRelations);
    }

    /**
    * Called after entity update.
    */
    async afterUpdate(event: UpdateEvent<any>) {
        if (this.entityStateService.isAuditEntity(event)) {
            return;
        }
        // console.log(`AFTER ENTITY UPDATED: `, event.entity);

        const entityState: EntityState = await this.entityStateService.createEntityState(event, OperationType.UPDATE);
        const entity = event.entity;

        await Promise.all(event.metadata.columns.map(async column => {

            const attribute = new EntityStateAttribute();
            attribute.entityState = entityState;
            attribute.name = column.propertyPath;

            if (event.metadata.relations.map(it => it.joinColumns)
                .reduce((a, b) => a.concat(b), [])
                .includes(column)) {
                if (!column.relationMetadata.isOwning) {
                    return;
                }

                const newValue = column.getEntityValue(entity);
                attribute.newValue = newValue && JSON.stringify(newValue);

                const oldValue = column.getEntityValue(event.databaseEntity);
                attribute.previousValue = oldValue && JSON.stringify(oldValue);
            } else {
                attribute.newValue = column.getEntityValue(entity);
                attribute.previousValue = column.getEntityValue(event.databaseEntity);
            }

            attribute.hasNewValue = !!attribute.newValue;
            attribute.hasPreviousValue = !!attribute.previousValue;
            attribute.modified = attribute.newValue === attribute.previousValue;

            await event.manager.save(attribute);
        }));
    }

    /**
     * Called after entity removal.
     */
    async beforeRemove(event: RemoveEvent<any>) {
        if (this.entityStateService.isAuditEntity(event)) {
            return;
        }
        const entityState: EntityState = await this.entityStateService.createEntityState(event, OperationType.DELETE);

        const entity = event.entity;

        Promise.all(event.metadata.columns.map(async column => {

            const attribute = new EntityStateAttribute();
            attribute.entityState = entityState;
            attribute.name = column.propertyPath;

            if (event.metadata.relations
                .map(it => it.joinColumns)
                .reduce((a, b) => a.concat(b), [])
                .includes(column)) {
                if (!column.relationMetadata.isOwning) {
                    return;
                }
                const value = column.getEntityValue(event.entity);
                attribute.previousValue = value && JSON.stringify(value);
            } else {
                attribute.previousValue = column.getEntityValue(event.entity);
            }

            attribute.hasNewValue = false;
            attribute.hasPreviousValue = !!attribute.previousValue;
            attribute.modified = true;

            await event.manager.save(attribute);
        }));
    }
}