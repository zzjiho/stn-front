import { Box, TextField, Select, MenuItem, FormControl, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export type DeviceSearchType = 'all' | 'title' | 'modelName';

interface DeviceSearchBarProps {
    onSearch: (searchType: DeviceSearchType, keyword: string) => void;
}

export function DeviceSearchBar({ onSearch }: DeviceSearchBarProps) {
    const [searchType, setSearchType] = useState<DeviceSearchType>('all');
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        onSearch(searchType, keyword);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as DeviceSearchType)}
                    sx={{ bgcolor: 'background.paper' }}
                >
                    <MenuItem value="all">전체</MenuItem>
                    <MenuItem value="title">장치명</MenuItem>
                    <MenuItem value="modelName">모델명</MenuItem>
                </Select>
            </FormControl>

            <TextField
                size="small"
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ flexGrow: 1, maxWidth: 400, bgcolor: 'background.paper' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}
