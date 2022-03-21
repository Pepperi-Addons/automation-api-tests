// export type TableObjectData = { [headerId: string]: string | null; };

export type TableObjectData<K extends keyof any, T> = {
    [P in K]: T;
};
