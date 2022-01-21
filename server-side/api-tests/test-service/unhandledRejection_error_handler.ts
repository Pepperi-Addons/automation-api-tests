process.on('unhandledRejection', async (error) => {
    if (error instanceof Error && JSON.stringify(error.stack).includes('selenium-webdriver\\lib\\http.js')) {
        console.log(`%cError in Chrome API: ${error}`, 'color: #e50000');
        console.log('Wait 10 seconds before trying to call the browser api again');
        console.debug(`%cAsync Sleep: ${10000} milliseconds`, 'color: #f7df1e');
        return new Promise((resolve) => setTimeout(resolve, 10000));
    } else {
        console.log(`%cError unhandledRejection: ${error}`, 'color: #e50000');
        console.debug(`%cAsync Sleep: ${2000} milliseconds`, 'color: #f7df1e');
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
});
