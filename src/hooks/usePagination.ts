import { useState, useCallback } from 'react';

/**
 * 페이지네이션 상태 관리 커스텀 훅
 * - 현재 페이지, 페이지 크기, 전체 항목 수 관리
 * - 페이지 변경 핸들러
 */
export function usePagination(initialPage = 1, initialSize = 10) {
    const [currentPageNo, setCurrentPageNo] = useState(initialPage);
    const [sizePerPage, setSizePerPage] = useState(initialSize);
    const [totalCnt, setTotalCnt] = useState(0);

    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPageNo(page);
    }, []);

    const setPaginationData = useCallback(({
        total,
        current,
        size
    }: { total: number, current: number, size: number }) => {
        setTotalCnt(total);
        setCurrentPageNo(Math.max(1, current));
        setSizePerPage(size);
    }, []);

    return {
        // 상태 값
        currentPageNo,    // 현재 페이지 번호
        sizePerPage,      // 페이지당 항목 수
        totalCnt,         // 전체 항목 수

        // 핸들러
        handlePageChange,
        setPaginationData,
    };
}
