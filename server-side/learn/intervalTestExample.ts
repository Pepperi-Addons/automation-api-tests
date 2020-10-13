import tester from '../tester';

const { describe, expect, it, run } = tester();

describe('learning about mocha in parallel (base)', function () {
    it('check properties on object in base', async function () {
        expect(true).to.be.true;
    });

    it('Positive Promise Base', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseBase = setInterval(() => {
                clearInterval(intervalInPromiseBase);
                resolve();
                console.log('wait 3 seconds in promise base');
                base = true;
            }, 3000);
        });
        expect(base).to.be.true;
    });

    it('Negative Promise One', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseOne = setInterval(() => {
                clearInterval(intervalInPromiseOne);
                resolve();
                console.log('wait 3 seconds in promise one');
                base = false;
            }, 3000);
        });
        expect(base).to.be.false;
    });
});

describe('learning about mocha parallel (two)', function () {
    it('Negative Promise Two', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseTwo = setInterval(() => {
                clearInterval(intervalInPromiseTwo);
                resolve();
                console.log('wait 3 seconds in promise two');
                base = false;
            }, 3000);
        });
        expect(base).to.be.false;
    });

    it('Negative Promise Three', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseThree = setInterval(() => {
                clearInterval(intervalInPromiseThree);
                resolve();
                console.log('wait 2 seconds in promise three');
                base = false;
            }, 2000);
        });
        expect(base).to.be.false;
    });

    it('Negative Promise Four', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseFour = setInterval(() => {
                clearInterval(intervalInPromiseFour);
                resolve();
                console.log('wait 4 seconds in promise four');
                base = false;
            }, 4000);
        });
        expect(base).to.be.false;
    });

    it('Positive Promise Five', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseFive = setInterval(() => {
                clearInterval(intervalInPromiseFive);
                resolve();
                console.log('wait 3 seconds in promise five');
                base = true;
            }, 3000);
        });
        expect(base).to.be.true;
    });

    it('Promise All Tests', async function () {
        const f = async () => {
            return {
                InternalID: 0,
                Title: '2',
                Name: '3',
            };
        };

        return Promise.all([
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
        ]);
    });

    it('check properties on object', function () {
        const res = [
            {
                InternalID: 0,
                Title: '2',
                Name: '3',
            },
        ];
        return Promise.all([
            expect(res).to.be.an('array').with.lengthOf(1),
            expect(res[0]).to.include({
                InternalID: 0,
                Title: '2',
            }),
        ]);
    });
});

run();
