export const getStatus = (type) => {
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