// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {DefaultCrudRepository, HasOneRepositoryFactory, juggler, repository,} from '@loopback/repository';
import {Getter, inject} from '@loopback/core';
import {UserCredentialsRepository} from './user-credentials.repository';
import {User} from "../models";
import {UserCredentials} from "../models";

export type Credentials = {
    email: string;
    password: string;
};

export class UserRepository extends DefaultCrudRepository<User,
    typeof User.prototype.id> {

    public readonly userCredentials: HasOneRepositoryFactory<UserCredentials,
        typeof User.prototype.id>;

    constructor(
        @inject('datasources.db') protected datasource: juggler.DataSource,
        @repository.getter('UserCredentialsRepository')
        protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    ) {
        super(User, datasource);
        this.userCredentials = this.createHasOneRepositoryFactoryFor(
            'userCredentials',
            userCredentialsRepositoryGetter,
        );
    }

    async findCredentials(
        userId: typeof User.prototype.id,
    ): Promise<UserCredentials | undefined> {
        try {
            return await this.userCredentials(userId).get();
        } catch (err) {
            if (err.code === 'ENTITY_NOT_FOUND') {
                return undefined;
            }
            throw err;
        }
    }
}
