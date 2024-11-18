import type { NextApiRequest, NextApiResponse } from 'next'
import { pgConn } from '../../backend/PostgresConnection';


const sqlFetchCountEnvs = `
SELECT split_part(project, '-', 4) env, count(project) count
FROM instance_infos.sql_instances_latest
GROUP BY 1
`;

//
// This API endpoint provides information about the number of instances in every environment.
// 
// Request: GET /api/count-envs
// example result: [{"env":"dev","count":"25"},{"env":"prd","count":"9"},{"env":"tuc","count":"16"},{"env":"tud","count":"13"}]
//
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{env: string, count: number}[]>
) {
    let countEnvs: {env: string, count: number}[] = [];
    await pgConn.query(sqlFetchCountEnvs).then((sqlRes: any) => countEnvs = sqlRes.rows);
    res.status(200).json(countEnvs);
}