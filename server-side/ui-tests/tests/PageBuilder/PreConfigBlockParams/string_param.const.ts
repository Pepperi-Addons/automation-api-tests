import { IBlockStringParameter } from '../../../../models/pages/index';

export const stringParam: Readonly<IBlockStringParameter> = {
    Key: 'stringParam',
    Consume: true,
    Produce: true,
    Type: 'String',
    Value: 'This is a string param',
};

Object.freeze(stringParam);
