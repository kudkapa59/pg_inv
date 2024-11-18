import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Alert, Container, Box, LinearProgress, Typography, Card, TablePagination, Chip, Stack, FormControl, InputLabel, Select, MenuItem, TableSortLabel } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CoBaSearchField from '../../components/CoBaSearchField';
import { useRouter } from 'next/router';
import { ApplicationShort } from '../../models/Application';
import Head from 'next/head'
import { visuallyHidden } from "@mui/utils";

const bcmClasses = [1, 2, 3, 4];

const headCells: readonly { id: keyof ApplicationShort, label: string, sortable: boolean }[] = [
    {
        id: 'product_nr',
        label: 'CoRIA',
        sortable: true,
    },
    {
        id: 'product_name',
        label: 'Application',
        sortable: true,
    },
    {
        id: 'bcm_klasse',
        label: 'BCM',
        sortable: true,
    },
    {
        id: 'availability_class',
        label: 'Availabilty',
        sortable: true,
    },
    {
        id: 'bpo',
        label: 'BPO',
        sortable: false,
    },
    {
        id: 'tpm',
        label: 'TPM',
        sortable: false,
    },
];

//
// This component represents the application overview page,
// that is used to overview all available applications and search for a specific one.
// 
const ApplicationsPage: NextPage = ({ search, bcm }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [rows, setRows] = useState<ApplicationShort[]>([]);
    const [pageSize, setPageSize] = useState(50);
    const [pageNum, setPageNum] = useState(0);
    const [count, setCount] = useState(0);
    const [bcmFilter, setBcmFilter] = useState(bcm ?? 0);
    const [orderBy, setOrderBy] = useState<keyof ApplicationShort>('product_nr');
    const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        // fetch applications from backend
        //
        // GET /api/applications?search=""&pageSize...
        // parameter: 
        //   search = search input used to filter instances by coria-id, name, project
        //   pageSize = number of instances on one page
        //   pageNum = page number
        //   env = selected environment (all, dev, tuc, tud, prd)
        //   status = instance status (commission, life)
        //   orderBy = order of the table by this column name
        //   order: = ASC / DESC
        // return:
        //  count: number of applications available for the selected filters
        //  rows: applications
        //
        // the corresponding backend implementation can be found in "dashboard/pages/api/applications/index.ts"
        fetch(`/api/applications?search=${searchInput}&pageSize=${pageSize}&pageNum=${pageNum}&bcm=${bcmFilter}&orderBy=${orderBy}&order=${order}`).then(async (res) => {
            if (res.ok) {
                const json = await res.json();
                setRows(json.rows as ApplicationShort[]);
                setCount(Number(json.count))
            }
        }).finally(() => setLoading(false));
    }, [searchInput, pageNum, pageSize, bcmFilter, orderBy, order]);

    return (
        <>
            <Head>
                <title>PG_INV | Applications</title>
            </Head>
            {loading ? <LinearProgress color="secondary" /> : <Box sx={{ height: '4px' }} />}
            <Container maxWidth="xl" sx={{ my: 2 }}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h3">Applications</Typography>
                <Card sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        {/* =================================================
                                         Application Search 
                        =====================================================*/}
                        <CoBaSearchField
                            onChange={(newVal) => {
                                // set new search input when user types into search box
                                router.query.search = newVal;
                                // add search string to url as query parameter
                                router.push({ pathname: router.pathname, query: router.query });
                                setSearchInput(newVal);
                            }}
                            infoTest="Search by, Coria ID or application name"
                            defaultValue={search}
                            loading={loading}
                        />
                        {/* =================================================
                                              BCM Select 
                        =====================================================*/}
                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="demo-simple-select-label">BCM Class</InputLabel>
                            <Select
                                value={bcmFilter}
                                label="BCM Class"
                                onChange={(event) => {
                                    // set new status when user clicks on dropdown
                                    const newVal = event.target.value as string;
                                    router.query.bcm = newVal;
                                    // add status to url as query parameter
                                    router.push({ pathname: router.pathname, query: router.query });
                                    setBcmFilter(newVal);
                                }}
                            >
                                <MenuItem value={0}><em>All</em></MenuItem>
                                {bcmClasses.map((bcm) => (<MenuItem key={bcm} value={bcm}>{bcm}</MenuItem>))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Card>
                <Card sx={{ p: 2, mt: 2 }}>
                    {/* =================================================
                                     Application Table
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
                                            <Link key={index} href={`/applications/${row.product_nr}`}>
                                                <TableRow
                                                    key={row.product_nr}
                                                    sx={{
                                                        // CSS style for highlighting row when cursor is over it
                                                        cursor: 'pointer',
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        '&:hover': {
                                                            backgroundColor: '#fafafa'
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="left">{row.product_nr}</TableCell>
                                                    <TableCell align="left">{row.product_name}</TableCell>
                                                    <TableCell align="left">{row.bcm_klasse}</TableCell>
                                                    <TableCell align="left">{row.availability_class ?? <Chip label="Error: No class found!" color="warning" />}</TableCell>
                                                    <TableCell align="left">{row.bpo}</TableCell>
                                                    <TableCell align="left">{row.tpm}</TableCell>
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
                                onPageChange={(_, newPage: number) => setPageNum(newPage)}
                                onRowsPerPageChange={(event) => {
                                    setPageNum(0);
                                    setPageSize(parseInt(event.target.value, 10));
                                }}
                            />
                        </>
                    ) : <Alert severity="info">No Entries found.</Alert>}
                </Card>
                <Box sx={{ height: '100px' }} />
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
            bcm: context.query.bcm && bcmClasses.includes(Number(context.query.bcm)) ? context.query.bcm : 0,
        }
    }
}


export default ApplicationsPage;
