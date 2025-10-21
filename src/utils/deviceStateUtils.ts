/**
 * 장치 관리 페이지의 상태를 URL 파라미터로 저장/복원하는 유틸 함수
 */

export type DeviceSearchType = 'all' | 'title' | 'modelName';
export type OrderType = 'title' | 'modelName' | 'regDate';
export type Order = 'asc' | 'desc';

export interface DevicePageState {
    page?: number;
    orderType?: OrderType;
    order?: Order;
    searchType?: DeviceSearchType;
    searchKeyword?: string;
}

// 현재 장치 관리 상태를 URL 파라미터로 변환
export function buildDeviceStateURL(state: DevicePageState): URLSearchParams {
    const params = new URLSearchParams();

    if (state.page) {
        params.append('page', state.page.toString());
    }

    if (state.orderType) {
        params.append('orderType', state.orderType);
    }
    if (state.order) {
        params.append('order', state.order);
    }

    if (state.searchKeyword) {
        if (state.searchType === 'all') {
            params.append('keyword', state.searchKeyword);
        } else if (state.searchType === 'title') {
            params.append('title', state.searchKeyword);
        } else if (state.searchType === 'modelName') {
            params.append('modelName', state.searchKeyword);
        }
    }

    return params;
}

// URL 파라미터에서 장치 관리 상태 복원
export function parseDeviceStateFromURL(searchParams: URLSearchParams): DevicePageState | null {
    const page = searchParams.get('page');
    const keyword = searchParams.get('keyword');
    const title = searchParams.get('title');
    const modelName = searchParams.get('modelName');
    const orderType = searchParams.get('orderType');
    const order = searchParams.get('order');

    if (!page && !keyword && !title && !modelName && !orderType && !order) {
        return null;
    }

    const state: DevicePageState = {};

    if (page) {
        const pageNum = parseInt(page, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
            state.page = pageNum;
        }
    }

    if (orderType && isValidOrderType(orderType)) {
        state.orderType = orderType as OrderType;
    }

    if (order && (order === 'asc' || order === 'desc')) {
        state.order = order as Order;
    }

    if (keyword) {
        state.searchType = 'all';
        state.searchKeyword = keyword;
    } else if (title) {
        state.searchType = 'title';
        state.searchKeyword = title;
    } else if (modelName) {
        state.searchType = 'modelName';
        state.searchKeyword = modelName;
    }

    return state;
}

function isValidOrderType(value: string): value is OrderType {
    return ['title', 'modelName', 'regDate'].includes(value);
}
