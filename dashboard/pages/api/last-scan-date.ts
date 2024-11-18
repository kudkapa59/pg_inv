import type { NextApiRequest, NextApiResponse } from 'next'
import { pgConn } from '../../backend/PostgresConnection';


const sqlFetchLastScanDate = `
SELECT scan_date FROM instance_infos.sql_instances_latest LIMIT 1;
`;

//
// This API-Endpoint provides the last scan date.
// The last scan date describes the last time the backend jobs fetched new data like instances, instance information or application details.
//
// Request: GET /api/last-scan-date
// example response: {"lastScanDate":"2022-12-21T10:38:01.864Z"}
//  
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ lastScanDate: number }>
) {
    let scanDate = 0;
    await pgConn.query(sqlFetchLastScanDate).then((sqlRes: any) => scanDate = sqlRes.rows[0].scan_date);
    res.status(200).json({ lastScanDate: scanDate });
}
