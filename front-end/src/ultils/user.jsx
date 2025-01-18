export const genderType = ['MALE', 'FEMALE'];

export const genderTypes = {
    '': 'Không',
    MALE: 'Nam',
    FEMALE: 'Nữ',
}

export const genderTypeItems = [
    {
        value: '',
        label: 'Không',
    },
    {
        value: 'MALE',
        label: 'Nam',
    },
    {
        value: 'FEMALE',
        label: 'Nữ',
    }
];

export const roleType = ['ROLE_USER', 'ROLE_SELLER', 'ROLE_ADMIN'];

export const roleTypes = {
    ROLE_USER: { label: 'Thành viên', color: 'default' },
    ROLE_SELLER: { label: 'Nhân viên', color: 'info' },
    ROLE_ADMIN: { label: 'Admin', color: 'primary' },
    1: { label: 'Thành viên', color: 'default' },
    2: { label: 'Nhân viên', color: 'info' },
    3: { label: 'Admin', color: 'primary' },
}

export const roleTypeItems = [
    {
        value: 1,
        label: 'Thành viên',
    },
    {
        value: 2,
        label: 'Nhân viên',
    },
    {
        value: 3,
        label: 'Admin',
    }
];