export const getOrderStatus = (type) => {
    switch (type) {
        case 'COMPLETED':
            return { status: 'Đã giao', color: 'success' };
        case 'PENDING':
            return { status: 'Đang chờ hàng', color: 'primary' };
        case 'SHIPPING':
            return { status: 'Đang giao', color: 'info' };
        case 'CANCELED':
            return { status: 'Đã huỷ', color: 'error' };
        case 'REFUNDED':
            return { status: 'Đã hoàn tiền', color: 'warning' };
    }
}

export const orderType = ['COMPLETED', 'PENDING', 'SHIPPING', 'CANCELED', 'REFUNDED'];

export const orderItems = [
    {
        value: '',
        label: 'Tất cả',
    },
    {
        value: 'PENDING',
        label: 'Chờ hàng',
    },
    {
        value: 'SHIPPING',
        label: 'Đang giao',
    },
    {
        value: 'COMPLETED',
        label: 'Hoàn thành',
    },
    {
        value: 'CANCELED',
        label: 'Đã huỷ',
    },
    {
        value: 'REFUNDED',
        label: 'Trả/Hoàn tiền',
    },
];