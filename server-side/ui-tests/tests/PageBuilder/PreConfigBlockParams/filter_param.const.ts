import { IBlockFilterParameter } from '../../../../models/pages/parameter-config.class';

export const filterParam: Readonly<IBlockFilterParameter> = {
    Key: 'filterParam',
    Consume: true,
    Produce: true,
    Type: 'Filter',
    Resource: 'accounts',
    Fields: ['paramAccount'],
    Value: [
        {
            resource: 'accounts',
            filter: {
                ApiName: 'paramAccount',
                FieldType: 'boolean',
                Operation: 'IsEqual',
                Values: ['true'],
            },
        },
    ],
};

Object.freeze(filterParam);
