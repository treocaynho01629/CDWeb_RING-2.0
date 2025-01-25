import { AutoStoriesOutlined, CategoryOutlined, EventOutlined, GroupOutlined, StarBorder, Storefront, TrendingUpOutlined } from "@mui/icons-material";

export const navigationList = [
    {
        label: 'Sản phẩm',
        icon: <AutoStoriesOutlined />,
        url: '/product',
    },
    {
        label: 'Cửa hàng',
        icon: <Storefront />,
        url: '/shop',
    },
    {
        isAdmin: true,
        label: 'Thành viên',
        icon: <GroupOutlined />,
        url: '/user',
    },
    {
        label: 'Đánh giá',
        icon: <StarBorder />,
        url: '/review',
    },
    {
        label: 'Doanh thu',
        icon: <TrendingUpOutlined />,
        url: '/order',
    },
    {
        label: 'Sự kiện',
        icon: <EventOutlined />,
        url: '/event',
    },
    {
        isAdmin: true,
        label: 'Khác',
        icon: <CategoryOutlined />,
        url: '/misc',
    },
];