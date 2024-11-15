const useReachable = async () => { //Fire a snack notification if it take too long to reach the server
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 5000, 'Request timed out'); //5s
    });
    const request = fetch(import.meta.env.VITE_PORT_SOCKET_SPRING);
    return Promise
        .race([timeout, request])
        .then(response => {
            console.log('Connected');
        })
        .catch(async error => {
            const { enqueueSnackbar } = await import('notistack');
            enqueueSnackbar('Server có thể mất một lúc để khởi động!', {
                variant: 'warning',
                autoHideDuration: 30000,
                preventDuplicate: true
            });
        });
}

export default useReachable;