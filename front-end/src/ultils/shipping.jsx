import { LocalShippingOutlined, RocketLaunchOutlined, SavingsOutlined } from "@mui/icons-material";

export const shippingType = ['STANDARD', 'ECONOMY', 'EXPRESS'];

export const shippingItems = [
    {
        value: 'STANDARD',
        label: 'Tiêu chuẩn',
        description: '2-4 ngày giao hàng',
        price: '10,000đ',
        color: '',
        icon: <LocalShippingOutlined/>
    },
    {
        value: 'ECONOMY',
        label: 'Tiết kiệm',
        description: '5-7 ngày giao hàng',
        price: '-8,000đ',
        color: 'success',
        icon: <SavingsOutlined/>
    },
    {
        value: 'EXPRESS',
        label: 'Hoả tốc',
        description: '1-2 ngày giao hàng',
        price: '+5,000đ',
        color: 'warning',
        icon: <RocketLaunchOutlined/>
    },
];