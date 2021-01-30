import "reflect-metadata";
import { createConnection } from "typeorm";
import { ActivityLog } from "../src/data/entity/ActivityLog";
import { EntityManagerFactory } from "../src/service/entity-manager.factory";
import { Address } from "./entity/Address";
import { User } from "./entity/User";

import('./conf/ormconfig').then(m => {
    createConnection(m.config).then(async connection => {

        const entityManagerFactory = new EntityManagerFactory(connection);
        // console.log("Inserting a new user into the database...");

        const insertActivity = new ActivityLog('SAVE USER');
        const savedUser = await entityManagerFactory.forActivity(insertActivity, async entityManager => {
            const address = new Address();
            address.country = 'USA';
            address.city = 'California';
            address.district = 'Mountain View';
            address.streetName = 'Amphitheatre Parkway';
            address.houseNumber = '1600';
            await entityManager.save(address);

            const user = new User();
            user.name.firstName = "Timber";
            user.name.lastName = "Saw";
            user.age = 25;
            user.address = address;
            return entityManager.save(user);
        });

        console.log("Saved a new user with id: " + savedUser.id);

        const updateActivity = new ActivityLog('UPDATE USER');
        await entityManagerFactory.forActivity(updateActivity, entityManager => {
            const user = savedUser;
            user.name.firstName = "Usain";
            user.name.lastName = "Bolt";
            user.age = 31;
            return entityManager.save(user);
        });

        const deleteActivity = new ActivityLog('DELETE USER');
        await entityManagerFactory.forActivity(deleteActivity, entityManager => {
            return entityManager.remove(savedUser);
        });

        // console.log("Here you can setup and run express/koa/any other framework.");

    }).catch(error => console.log(error));
});
