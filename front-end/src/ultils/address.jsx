export const getAddress = (type) => {
    switch (type) {
        case 'HOME':
            return { label: 'Nhà riêng', color: 'primary' };
        case 'OFFICE':
            return { label: 'Văn phòng', color: 'info' };
    }
}

export const getAddressType = ['HOME', 'OFFICE'];

export const addressItems = [
    {
        value: 'HOME',
        label: 'Nhà riêng',
    },
    {
        value: 'OFFICE',
        label: 'Văn phòng',
    },
];