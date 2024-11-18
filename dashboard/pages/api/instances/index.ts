import type { NextApiRequest, NextApiResponse } from 'next'
import { InstanceShort } from '../../../models/Instance';
import { pgConn } from '../../../backend/PostgresConnection';

const orderKeys: string[] = ["coba_coria", "project", "lifecycle_status", "location", "cpu", "mem_mb", "disk_size_gb", "version"];
const isOrderKey = (keyInput: string) => orderKeys.includes(keyInput);
type Order = "asc" | "desc";

const sqlCountInstances = `
SELECT count(*)
FROM instance_infos.sql_instances_latest
WHERE 
    (coalesce(user_labels->>'coba_coria','') LIKE $1 OR instance_name LIKE $1 OR project LIKE $1 OR user_labels IS NULL) 
    AND split_part(project, '-', 4) LIKE $2 
    AND (coalesce(user_labels->>'coba-life-cycle-status','') LIKE $3 OR user_labels IS NULL)
`;

const sqlFetchInstances = (orderBy: string, order: Order) => `
SELECT 
    user_labels->>'coba_coria' as coba_coria, 
    instance_name, 
    zone as location,
    user_labels->>'coba-life-cycle-status' as lifecycle_status, 
    project, 
    sub_version as version, 
    cpu, 
    mem_mb, 
    disk_size_gb
FROM instance_infos.sql_instances_latest
WHERE 
    (coalesce(user_labels->>'coba_coria','') LIKE $1 OR instance_name LIKE $1 OR project LIKE $1 OR user_labels IS NULL) 
    AND split_part(project, '-', 4) LIKE $2 
    AND (coalesce(user_labels->>'coba-life-cycle-status','') LIKE $3 OR user_labels IS NULL)
ORDER BY ${orderBy} ${order}
LIMIT $4
OFFSET $5;
`;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ count: number, rows: InstanceShort[] }>
) {

    let searchParam = req.query.search ? `%${req.query.search}%` : '%';
    let pageNum = Number(req.query.pageNum ?? '0');
    let pageSize = Number(req.query.pageSize ?? '40');
    let env = !req.query.env || req.query.env.length < 1 ? '%' : req.query.env;
    let status = !req.query.status || req.query.status.length < 1 ? '%' : req.query.status;
    let orderBy: string = (req.query.orderBy && isOrderKey(req.query.orderBy as string)) ? req.query.orderBy as string : orderKeys[0];
    let order: Order = req.query.order && (req.query.order === 'asc' || req.query.order === 'desc') ? req.query.order : 'asc';

    let limit = pageSize;
    let offset = pageSize * pageNum;

    let count = 0;
    let rows: InstanceShort[] = []

    await Promise.all([
        pgConn.query(sqlCountInstances, [searchParam, env, status]).then((sqlRes: any) => count = sqlRes.rows[0].count).catch(e => console.log(e)),
        pgConn.query(sqlFetchInstances(orderBy, order), [searchParam, env, status, limit, offset]).then((sqlRes: any) => rows = sqlRes.rows).catch(e => console.log(e)),
    ])

    res.status(200).json({ count, rows });
}
