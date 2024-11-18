import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Alert, Container, Box, LinearProgress, Typography, Card, TablePagination, Stack, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from "@mui/material/TableSortLabel";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CoBaSearchField from '../../components/CoBaSearchField';
import { useRouter } from 'next/router';
import { InstanceShort } from '../../models/Instance';
import Head from 'next/head'
import { visuallyHidden } from "@mui/utils";

const envs = ["dev", "tuc", "tud", "prd"];
const status = ["commission", "life"];

const headCells: readonly { id: keyof InstanceShort, label: string, sortable: boolean }[] = [
    {
        id: 'instance_name',
        label: 'Instance Name',
        sortable: true,
    },
    {
        id: 'coba_coria',
        label: 'CoRIA ID',
        sortable: true,
    },
    {
        id: 'project',
        label: 'Environment',
        sortable: true,
    },
    {
        id: 'lifecycle_status',
        label: 'Status',
        sortable: true,
    },
    {
        id: 'location',
        label: 'Location',
        sortable: true,
    },
    {
        id: 'cpu',
        label: 'CPUs',
        sortable: true,
    },
    {
        id: 'mem_mb',
        label: 'Memory',
        sortable: true,
    },
    {
        id: 'disk_size_gb',
        label: 'Disk',
        sortable: true,
    },
    {
        id: 'version',
        label: 'Version',
        sortable: true,
    },
];

function getEnvFromName(name: string) {
    for (const env of envs) {
        if (name.includes(`-${env}-`)) {
            return env;
        }
    }
}

function getCPUsFromName(name: string) {
    return name.startsWith('db-custom-') ? name.split('-')[2] : name
}

function getMemoryFromName(name: string) {
    return name.startsWith('db-custom-') ? name.split('-')[3] : name
}

//
// This component represents the instance overview page,
// that is used to overview all available instances and search for a specific one.
// 
const InstancesPage: NextPage = ({ search, selectedEnv, selectedStatus }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(search ?? '');
    const [rows, setRows] = useState<InstanceShort[]>([]);
    const [pageSize, setPageSize] = useState(50);
    const [pageNum, setPageNum] = useState(0);
    const [count, setCount] = useState<number>(0);
    const [envFilter, setEnvFilter] = useState(selectedEnv ?? '');
    const [statusFilter, setStatusFilter] = useState(selectedStatus ?? '');
    const [orderBy, setOrderBy] = useState<keyof InstanceShort>('instance_name');
    const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
    const router = useRouter();

    /* =================================================
                       Data Fetching
    =====================================================*/
    useEffect(() => {
        setLoading(true);
        // fetch instances from backend
        //
        // GET /api/instances?search=""&pageSize...
        // parameter: 
        //   search = search input used to filter instances by coria-id, name, project
        //   pageSize = number of instances on one page
        //   pageNum = page number
        //   env = selected environment (all, dev, tuc, tud, prd)
        //   status = instance status (commission, life)
        //   orderBy = order of the table by this column name
        //   order: = asc / desc
        // return:
        //   count: number of instances available for the selected filters
        //   rows: instances
        //
        // the corresponding backend implementation can be found in "dashboard/pages/api/instances/index.ts"
        fetch(`/api/instances?search=${searchInput}&pageSize=${pageSize}&pageNum=${pageNum}&env=${envFilter}&status=${statusFilter}&orderBy=${orderBy}&order=${order}`)
            .then(async (res) => {
                if (res.ok) {
                    const json = await res.json();
                    setRows(json.rows as InstanceShort[]);
                    setCount(Number(json.count))
                }
            }).finally(() => setLoading(false));
    }, [searchInput, pageNum, pageSize, envFilter, statusFilter, orderBy, order]);

    return (
        <>
            <Head>
                <title>PG_INV | Instances</title>
            </Head>
            {loading ? <LinearProgress color="secondary" /> : <Box sx={{ height: '4px' }} />}
            <Container maxWidth="xl" sx={{ my: 2 }}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h3">Instances</Typography>
                <Card sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        {/* =================================================
                                         Information Search 
                        =====================================================*/}
                        <CoBaSearchField
                            placeholder="CoRIA ID, name, project"
                            onChange={(newVal) => {
                                // set new search input when user types into search box
                                router.query.search = newVal;
                                // add search string to url as query parameter
                                router.push({ pathname: router.pathname, query: router.query });
                                setSearchInput(newVal);
                            }}
                            infoTest="Search by CoRIA ID, instance name or project."
                            defaultValue={search}
                            loading={loading}
                        />
                        {/* =================================================
                                         Environment Select
                        =====================================================*/}
                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel>Environment</InputLabel>
                            <Select
                                value={envFilter}
                                label="Environment"
                                onChange={(event) => {
                                    // set new environment when user clicks on dropdown
                                    const newVal = event.target.value as string;
                                    router.query.env = newVal;
                                    // add environment to url as query parameter
                                    router.push({ pathname: router.pathname, query: router.query });
                                    setEnvFilter(newVal);
                                }}
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {envs.map((env) => (<MenuItem key={env} value={env}>{env}</MenuItem>))}
                            </Select>
                        </FormControl>
                        {/* =================================================
                                            Status Select 
                        =====================================================*/}
                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(event) => {
                                    // set new status when user clicks on dropdown
                                    const newVal = event.target.value as string;
                                    router.query.status = newVal;
                                    // add status to url as query parameter
                                    router.push({ pathname: router.pathname, query: router.query });
                                    setStatusFilter(newVal);
                                }}
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {status.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Card>
                <Card sx={{ p: 2, mt: 2, mb: '100px' }}>
                    {/* =================================================
                                        Instance Table 
                    =====================================================*/}
                    {rows.length > 0 || loading ? (
                        <>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {headCells.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    sortDirection={orderBy === headCell.id ? order : false}
                                                >
                                                    {headCell.sortable ?
                                                        <TableSortLabel
                                                            active={orderBy === headCell.id}
                                                            direction={orderBy === headCell.id ? order : undefined}
                                                            onClick={(event: React.MouseEvent<unknown>) => {
                                                                const newOrder = order === 'asc' ? 'desc' : 'asc'
                                                                // set new order when user clicks on label
                                                                router.query.order = newOrder;
                                                                router.query.orderBy = headCell.id;
                                                                // add order to url as query parameter
                                                                router.push({ pathname: router.pathname, query: router.query });
                                                                setOrder(newOrder);
                                                                setOrderBy(headCell.id);
                                                            }}
                                                        >
                                                            {headCell.label}
                                                            {orderBy === headCell.id ? (
                                                                <Box component="span" sx={visuallyHidden}>
                                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                </Box>
                                                            ) : null}
                                                        </TableSortLabel>
                                                        : headCell.label
                                                    }
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <Link key={index} href={`/instances/${row.instance_name}`}>
                                                <TableRow
                                                    key={row.coba_coria}
                                                    sx={{
                                                        // CSS style for highlighting row when cursor is over it
                                                        cursor: 'pointer',
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        '&:hover': {
                                                            backgroundColor: '#fafafa'
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="left">{row.instance_name}</TableCell>
                                                    <TableCell align="left">{row.coba_coria}</TableCell>
                                                    <TableCell align="left"><Chip label={getEnvFromName(row.project)} color="primary" title={row.project} /></TableCell>
                                                    <TableCell align="left">{row.lifecycle_status}</TableCell>
                                                    <TableCell align="left">{row.location}</TableCell>
                                                    <TableCell align="left">{getCPUsFromName(row.cpu)}</TableCell>
                                                    <TableCell align="left">{getMemoryFromName(row.mem_mb)}</TableCell>
                                                    <TableCell align="left">{row.disk_size_gb}</TableCell>
                                                    {/* Version is converted for better readability (POSTGRES_14_7 -> 14.7). */}
                                                    <TableCell align="left">{row.version.split('_').slice(1).join('.')}</TableCell>
                                                </TableRow>
                                            </Link>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={count}
                                rowsPerPage={pageSize}
                                page={pageNum}
                                onPageChange={(event: unknown, newPage: number) => setPageNum(newPage)}
                                onRowsPerPageChange={(event) => {
                                    setPageNum(0);
                                    setPageSize(parseInt(event.target.value, 10));
                                }}
                            />
                        </>
                    ) : <Alert severity="info">No Entries found.</Alert>}
                </Card>
            </Container>
        </>
    )
}

// Inject url params as component props to be able to fetch correct values during backend render step.
// (This is needed because the UI is rendered on the backend.)
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            search: context.query.search ?? '',
            selectedEnv: context.query.env && envs.includes(context.query.env as string) ? context.query.env : '',
            selectedStatus: context.query.status && status.includes(context.query.status as string) ? context.query.status : '',
        }
    }
}

export default InstancesPage;
