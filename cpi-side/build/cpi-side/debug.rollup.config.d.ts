declare const _default: {
    input: string;
    output: {
        dir: string;
        format: string;
        sourcemap: string;
        sourcemapExcludeSources: boolean;
        sourcemapPathTransform: (relativeSourcePath: any, sourcemapPath: any) => string;
    }[];
    external: never[];
    plugins: import("rollup").Plugin[];
}[];
export default _default;
