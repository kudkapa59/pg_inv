import type { NextApiRequest, NextApiResponse } from 'next'
import { Instance } from '../../../models/Instance';
import { pgConn } from '../../../backend/PostgresConnection';
import { Database } from '../../../models/Database';
import { User } from '../../../models/User';

const sqlFetchInstanceInfos = `
SELECT 
    *, 
    zone as location, 
    sub_version as version, 
    user_labels->>'coba_coria' as coba_coria, 
    user_labels as labels, 
    replica_enabled as replicas, 
    backups_enabled as backups
FROM instance_infos.sql_instances_latest
WHERE instance_name = $1
LIMIT 1;
`

const sqlFetchDatabaseInfos = `
select sdl.database_name as name, sdl.charset
from detail_infos.sql_databases_latest sdl, instance_infos.sql_instances_latest si
where sdl.instance_name = si.instance_name
and sdl.project = si.project
and si.instance_name = $1
and si.project = $2
`;

const sqlFetchUserInfos = `
select sdl.user_name as name
from detail_infos.sql_users_latest sdl, instance_infos.sql_instances_latest si
where sdl.instance_name = si.instance_name
and sdl.project = si.project
and si.instance_name = $1
and si.project = $2
`;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Instance | string>
) {
    const { id } = req.query;

    if (typeof id === 'string') {

        let instanceInfos: Instance | undefined;
        let databaseInfos: Database[] = [];
        let userInfos: User[] = [];

        await pgConn.query(sqlFetchInstanceInfos, [id]).then((sqlRes: any) => instanceInfos = (sqlRes.rows[0] as Instance));
        if (instanceInfos !== undefined) {
            await Promise.all([
                pgConn.query(sqlFetchDatabaseInfos, [id, instanceInfos.project]).then((sqlRes: any) => databaseInfos = sqlRes.rows),
                pgConn.query(sqlFetchUserInfos, [id, instanceInfos.project]).then((sqlRes: any) => userInfos = sqlRes.rows),
            ])

            res.status(200).json({
                coba_coria: instanceInfos.coba_coria,
                instance_name: instanceInfos.instance_name,
                ip_address: instanceInfos.ip_address,
                project: instanceInfos.project,
                lifecycle_status: instanceInfos.lifecycle_status,
                status: instanceInfos.status,
                version: instanceInfos.version,
                location: instanceInfos.location,
                type: instanceInfos.type,
                create_time: instanceInfos.create_time,
                cpu: instanceInfos.cpu,
                mem_mb: instanceInfos.mem_mb,
                backups: instanceInfos.backups,
                disk_size_gb: instanceInfos.disk_size_gb,
                replicas: instanceInfos.replicas,
                databases: databaseInfos,
                dbusers: userInfos,
                labels: instanceInfos.labels,
            })
        } else {
            res.status(404).send('Requested id not found!');
        }
    } else {
        res.status(400).send('Missing id in query path.');
    }
}
