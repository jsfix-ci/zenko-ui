export default function auth(state = {}, action) {
    switch (action.type) {
    case 'LOG_IN':
        return {
            ...state,
            apiClient: action.apiClient,
        };
    default:
        return state;
    }
}
