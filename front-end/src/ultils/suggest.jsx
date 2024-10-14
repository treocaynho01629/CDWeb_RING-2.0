import { InsertEmoticon, LocalActivity, LocalMall, Loyalty, MonetizationOn, NewReleases, ShoppingCartCheckout, Store, ThumbUp, Whatshot } from "@mui/icons-material";

export const suggest = [
    {
        icon: <Whatshot />,
        color: '#d07165',
        label: 'Hot',
        url: '/filters?sortBy=totalOrders'
    },
    {
        icon: <LocalMall />,
        color: '#c685c3 ',
        label: 'Tìm kiếm',
        url: '/filters'
    },
    {
        icon: <Loyalty />,
        color: '#87c86d',
        label: 'Mã giảm giá',
        url: '/'
    },
    {
        icon: <NewReleases />,
        color: '#ddb067',
        label: 'Sản phẩm mới',
        url: '/filters?sortBy=createdDate'
    },
    {
        icon: <Store />,
        color: '#8fb2c6',
        label: 'Cửa hàng',
        url: '/'
    },
    {
        icon: <MonetizationOn />,
        color: '#dbad63',
        label: 'Khuyến mãi',
        url: '/'
    },
    {
        icon: <ShoppingCartCheckout />,
        color: '#a0df6d ',
        label: 'Giỏ hàng',
        url: '/cart'
    },
    {
        icon: <ThumbUp />,
        color: '#e6eb62 ',
        label: 'Yêu thích',
        url: '/filters?sortBy=rating'
    },
    {
        icon: <InsertEmoticon />,
        color: '#aaaa9f ',
        label: 'Hồ sơ',
        url: '/profile/detail'
    },
    {
        icon: <LocalActivity />,
        color: '#a0e3de ',
        label: 'Sự kiện',
        url: '/'
    },
];