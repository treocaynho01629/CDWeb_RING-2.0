import styled from "@emotion/styled";
import {
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
  ResponsiveContainer,
  LabelList,
  Label,
  Sector,
} from "recharts";
import { Avatar, Grid2 as Grid, Paper, useTheme } from "@mui/material";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import {
  useGetTopSellersQuery,
  useGetTopUsersQuery,
} from "../../features/users/usersApiSlice";
import { useState } from "react";

//#region styled
const TooltipContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.background.default};
  border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
  padding: 10px;
`;

const NameText = styled.div`
  display: flex;
  align-items: center;
`;

const ChartTitle = styled.h3`
  display: flex;
  align-items: center;
  width: 95%;
`;
//#endregion

const COLORS = ["#8dcbf5", "#63e399", "#FFBB28", "#fa7575", "#cef87f"];

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-15}
        textAnchor="middle"
        fill={fill}
        fontWeight={"bold"}
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={5}
        textAnchor="middle"
        fill={"black"}
        fontWeight={"bold"}
      >
        {`${value.toLocaleString()} đ`}
      </text>
      <text
        x={cx}
        y={cy}
        dy={25}
        textAnchor="middle"
        fill={"black"}
        fontWeight={"bold"}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const renderLabel = function (entry) {
  return entry.name;
};

const getIntroOfPage = (label, value) => {
  if (label === "data.books") {
    return `Số bán được: ${value}`;
  }
  if (label === "data.sales") {
    return `Doanh thu: ${value.toLocaleString()} đ`;
  }
  return "";
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <NameText>
          <Avatar sx={{ marginRight: 1 }}>
            {payload[0]?.name?.charAt(0) ?? ""}
          </Avatar>
          {payload[0].name}
        </NameText>
        <p style={{ margin: 0 }}>
          {getIntroOfPage(payload[0]?.dataKey, payload[0]?.value)}
        </p>
      </TooltipContainer>
    );
  }

  return null;
};

const ChartUsers = () => {
  // const theme = useTheme();
  const { isLoading: loadUsers, data: usersData } = useGetTopUsersQuery();
  const { isLoading: loadSellers, data: sellersData } = useGetTopSellersQuery();
  const [activeIndex, setActiveIndex] = useState(1);

  const onPieEnter = (e, index) => {
    setActiveIndex(index);
  };

  if (loadUsers || loadSellers) {
    return <></>;
  }

  return (
    <Grid container size="grow" spacing={3}>
      <Grid size="grow">
        <Paper
          elevation={3}
          sx={{
            pb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChartTitle>
            <BarChartIcon />
            &nbsp;Xếp hạng khách hàng
          </ChartTitle>
          <ResponsiveContainer width="95%" height={350}>
            <BarChart
              data={usersData}
              margin={{ top: 0, right: 0, left: 15, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 13 }}>
                <Label value="Tên thành viên" offset={1} position="bottom" />
              </XAxis>
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend verticalAlign="top" align="left" height={45} />
              <Bar
                dataKey="data.spends"
                yAxisId="left"
                fill="#8dcbf5"
                name="Đơn đặt"
              />
              <Bar
                dataKey="data.reviews"
                yAxisId="right"
                fill="#63e399"
                name="Đánh giá"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid size="auto">
        <Paper
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <ChartTitle>
            <PieChartIcon />
            &nbsp;Xếp hạng nhân viên
          </ChartTitle>
          <ResponsiveContainer
            width={500}
            height="95%"
            style={{ overflow: "visible" }}
          >
            <PieChart>
              {/* <Tooltip content={<CustomPieTooltip />} /> */}
              <Pie
                data={sellersData}
                dataKey="data.books"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
              >
                {sellersData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Pie
                labelLine={true}
                data={sellersData}
                dataKey="data.sales"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={105}
                outerRadius={130}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                label={renderLabel}
              >
                {sellersData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                payload={[
                  {
                    margin: { top: 10 },
                    id: "sales",
                    type: "triangle",
                    value: "Tổng sản phẩm bán (Vòng trong)",
                    color: "#8dcbf5",
                  },
                  {
                    id: "orders",
                    type: "triangle",
                    value: "Doanh thu (Vòng ngoài)",
                    color: "#63e399",
                  },
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChartUsers;
