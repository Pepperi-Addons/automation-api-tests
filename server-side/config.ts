const config = {
    baseUrl:
        process.env.BASE_URL || `https://app${process.env.npm_config_server == 'stage' ? '.sandbox' : ''}.pepperi.com`,
    mochawesomeReportDir: `/tmp/UI_Test-Default}-Tests-Results-${new Date()
        .toISOString()
        .substring(0, 16)
        .replace(/-/g, '.')
        .replace(/:/g, '_')
        .replace(/T/g, 'T_')}`,
};

export default config;
