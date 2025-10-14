import type {GridColDef} from '@mui/x-data-grid';
import {Chip} from '@mui/material';
import type {User} from '../../../types/index';

export function createUserTableColumns(): GridColDef<User>[] {
    return [
        {
            field: 'username',
            headerName: '사용자명',
            flex: 1,
            minWidth: 150,
            sortable: false,
        },
        {
            field: 'email',
            headerName: '이메일',
            flex: 1.5,
            minWidth: 200,
            sortable: false,
        },
        {
            field: 'role',
            headerName: '권한',
            flex: 0.8,
            minWidth: 100,
            sortable: false,
            renderCell: (params) => {
                const color = params.value === 'ADMIN' ? 'error' : 'default';
                const label = params.value === 'ADMIN' ? '관리자' : '사용자';
                return <Chip label={label} color={color} size="small"/>;
            },
        },
        {
            field: 'status',
            headerName: '상태',
            flex: 1,
            minWidth: 120,
            sortable: false,
            renderCell: (params) => {
                let color: 'warning' | 'success' | 'error' = 'warning';
                let label = '대기중';

                if (params.value === 'APPROVED') {
                    color = 'success';
                    label = '승인';
                } else if (params.value === 'REJECTED') {
                    color = 'error';
                    label = '거부';
                }

                return <Chip label={label} color={color} size="small"/>;
            },
        },
    ];
}
