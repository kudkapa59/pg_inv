import type { NextApiRequest, NextApiResponse } from 'next'
import { Application } from '../../../models/Application';
import { InstanceShort } from '../../../models/Instance';
import { Responsibility } from '../../../models/Responsibility';
import { pgConn } from '../../../backend/PostgresConnection';

const sqlFetchApplicationInfos = `
SELECT *
FROM application_infos.appl_info_latest
WHERE product_nr = $1;
`

const sqlFetchResponsibilitieInfos = `
SELECT distinct arl.user_id, ac.name, ac.department, ac.type_key, ac.telefon, ac.telefon2, ac.email, ac.description
FROM application_infos.appl_responsibilities_latest arl, application_infos.appl_contacts_latest ac
WHERE product_nr = $1
AND arl.user_id = ac.user_id;
`;

const sqlFetchInstancesInfos = `
select
    *,
    zone as location, 
    sub_version as version, 
    user_labels->>'coba_coria' as coba_coria, 
    user_labels as labels, 
    replica_enabled as replicas, 
    backups_enabled as backups
from instance_infos.sql_instances_latest
where user_labels->>'coba_coria' = $1
`;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Application | string>
) {
    const { id } = req.query;

    if (typeof id === 'string') {

        let instanceInfos: InstanceShort[] | undefined;
        let applicationInfos: Application | undefined;
        let responsibilityInfos: Responsibility[] | undefined;

        await pgConn.query(sqlFetchApplicationInfos, [id]).then((sqlRes: any) => applicationInfos = (sqlRes.rows[0] as Application));
        if (applicationInfos !== undefined) {
            await Promise.all([
                pgConn.query(sqlFetchInstancesInfos, [id.replace(/-/g,'')]).then((sqlRes: any) => instanceInfos = sqlRes.rows),
                pgConn.query(sqlFetchResponsibilitieInfos, [id]).then((sqlRes: any) => responsibilityInfos = sqlRes.rows),
            ])

            res.status(200).json({
                product_nr: applicationInfos.product_nr,
                product_name: applicationInfos.product_name,
                bcm_klasse: applicationInfos.bcm_klasse,
                availability_class: applicationInfos.availability_class,
                instances: instanceInfos ?? [],
                responsibilites: responsibilityInfos ?? []
            });
        } else {
            res.status(404).send('Requested id not found!');
        }
    } else {
        res.status(400).send('Missing id in query path.');
    }
}
