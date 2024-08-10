import React from 'react'
import {
    BarChart, CartesianGrid, Pie, PieChart, Label,
    XAxis, YAxis, Tooltip, Legend, Bar, Cell, ResponsiveContainer
} from 'recharts'
import { Grid, Paper } from '@mui/material'
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from '@mui/icons-material';

const ACCOUNTS_URL = 'api/accounts/top-accounts';
const SELLERS_URL = 'api/accounts/top-sellers';
const COLORS = ['#8dcbf5', '#63e399', '#FFBB28', '#fa7575', '#cef87f'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="dark gray" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const ChartAccounts = () => {
    return (<p>TEMP</p>)
    // const { loading: loadingAccounts, data: accounts } = usePrivateFetch(ACCOUNTS_URL);
    // const { loading: loadingSellers, data: sellers } = usePrivateFetch(SELLERS_URL);

    // if (loadingAccounts || loadingSellers) {
    //     return (<></>)
    // }

    // return (
    //     <Grid container spacing={3} sx={{ mb: 3 }}>
    //         <Grid item xs={12} lg={7}>
    //             <Paper elevation={3} sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    //                 <h3 style={{ display: 'flex', alignItems: 'center' }}><BarChartIcon />&nbsp;Biểu đồ xếp hạng khách hàng</h3>
    //                 <ResponsiveContainer width="95%" height={350}>
    //                     <BarChart data={accounts}>
    //                         <CartesianGrid strokeDasharray="3 3" />
    //                         <XAxis dataKey="name" />
    //                         <YAxis />
    //                         <Tooltip />
    //                         <Legend />
    //                         <Bar dataKey="data" fill="#8dcbf5" name="Đánh giá" />
    //                         <Bar dataKey="otherData" fill="#63e399" name="Đơn đặt" />
    //                     </BarChart>
    //                 </ResponsiveContainer>
    //             </Paper>
    //         </Grid>
    //         <Grid item xs={12} lg={5}>
    //             <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    //                 <h3 style={{ display: 'flex', alignItems: 'center' }}><PieChartIcon />&nbsp;Biểu đồ xếp hạng nhân viên</h3>
    //                 <ResponsiveContainer width="95%" height={350}>
    //                     <PieChart>
    //                         <Tooltip />
    //                         <Pie data={sellers} dataKey="otherData" nameKey="name" cx="50%" cy="50%" outerRadius={75} fill="#8dcbf5">
    //                             {sellers?.map((entry, index) => (
    //                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //                             ))}
    //                         </Pie>
    //                         <Pie data={sellers} dataKey="data" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={155} fill="#63e399" labelLine={false} label={renderCustomizedLabel}>
    //                             {sellers?.map((entry, index) => (
    //                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //                             ))}
    //                         </Pie>
    //                         <Legend
    //                             payload={[
    //                                 {
    //                                     id: "books",
    //                                     type: "square",
    //                                     value: `Số sách bán (Vòng ngoài)`,
    //                                     color: '#63e399'
    //                                 },
    //                                 {
    //                                     id: "orders",
    //                                     type: "square",
    //                                     value: `Số bán được (Vòng trong)`,
    //                                     color: '#8dcbf5'
    //                                 }]
    //                             }
    //                         />
    //                     </PieChart>
    //                 </ResponsiveContainer>
    //             </Paper>
    //         </Grid>
    //     </Grid>
    // )
}

export default ChartAccounts