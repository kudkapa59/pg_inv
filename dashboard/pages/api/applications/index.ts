import type { NextApiRequest, NextApiResponse } from 'next'
import { pgConn } from '../../../backend/PostgresConnection';
import { ApplicationShort } from '../../../models/Application';

const orderKeys: string[] = ["product_nr", "product_name", "availability_class"];
const isOrderKey = (keyInput: string) => orderKeys.includes(keyInput);
type Order = "asc" | "desc";

const sqlCountApplications = `
SELECT count(*) FROM application_infos.appl_info_latest WHERE (product_nr LIKE $1 OR product_name LIKE $1) AND availability_class LIKE $2 OR availability_class IS NULL;
`;

const sqlFetchApplications = (orderBy: string, order: Order) => `
SELECT distinct
    ail.product_nr,
    ail.product_name,
    ail.bcm_klasse,
    ail.availability_class,
    CASE WHEN acl_bpo.type_key = 'BPO' THEN acl_bpo.name
         ELSE '-'
         END AS bpo,
    CASE WHEN acl_tpm.type_key = 'TPM' THEN acl_tpm.name
         ELSE '-'
         END AS tpm
FROM
    application_infos.appl_info_latest                ail,
    application_infos.appl_responsibilities_latest    arl_bpo,
    application_infos.appl_contacts_latest            acl_bpo,
    application_infos.appl_responsibilities_latest    arl_tpm,
    application_infos.appl_contacts_latest            acl_tpm
WHERE
        (ail.product_nr LIKE $1 OR ail.product_name LIKE $1) -- search by product name, nr 
    AND (ail.availability_class LIKE $2 OR ail.availability_class IS NULL) -- filter by BCM class
    AND ail.product_nr = arl_bpo.product_nr
    AND arl_bpo.user_id = acl_bpo.user_id
    AND ail.product_nr = arl_tpm.product_nr
    AND arl_tpm.user_id = acl_tpm.user_id
    AND (   (acl_tpm.type_key = 'TPM' AND acl_bpo.type_key = 'BPO')
         OR (acl_tpm.type_key = 'BPO' AND acl_bpo.type_key = 'BPO' AND (SELECT COUNT(*)
                                                                        FROM application_infos.appl_responsibilities_latest inner_arl
                                                                        WHERE inner_arl.product_nr = arl_bpo.product_nr) = 1)
         OR (acl_tpm.type_key = 'TPM' AND acl_tpm.type_key = 'TPM' AND (SELECT COUNT(*)
                                                                        FROM application_infos.appl_responsibilities_latest inner_arl
                                                                        WHERE inner_arl.product_nr = arl_tpm.product_nr) = 1)
        )
ORDER BY ail.${orderBy} ${order}
LIMIT $3
OFFSET $4;
`;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ count: number, rows: ApplicationShort[] }>
) {
    let searchParam = req.query.search ? `%${req.query.search}%` : '%';
    let pageNum = Number(req.query.pageNum ?? '0');
    let pageSize = Number(req.query.pageSize ?? '40');
    let orderBy: string = (req.query.orderBy && isOrderKey(req.query.orderBy as string)) ? req.query.orderBy as string : orderKeys[0];
    let order: Order = req.query.order && (req.query.order === 'asc' || req.query.order === 'desc') ? req.query.order : 'asc';
    let bcm = req.query.bcm && Number(req.query.bcm) > 0 && Number(req.query.bcm) < 5 ? req.query.bcm : '%';

    let limit = pageSize;
    let offset = pageSize * pageNum;

    let count = 0;
    let rows: any[] = []

    await Promise.all([
        pgConn.query(sqlCountApplications, [searchParam, bcm]).then((sqlRes: any) => count = sqlRes.rows[0].count),
        pgConn.query(sqlFetchApplications(orderBy, order), [searchParam, bcm, limit, offset]).then((sqlRes: any) => rows = sqlRes.rows),
    ])
    res.status(200).json({ count, rows });
}
