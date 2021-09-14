import { describe, it } from 'mocha';

//7 Seconds
describe('suite1', function () {
    it('test1', function (done) {
        setTimeout(done, 100);
    });
    it('test2', function (done) {
        setTimeout(done, 1500);
    });
    it('test3', function (done) {
        setTimeout(done, 1500);
    });
    it('test4', function (done) {
        setTimeout(done, 1500);
    });
    it('test5', function (done) {
        setTimeout(done, 1500);
    });
    it('test6', function (done) {
        setTimeout(done, 400);
    });
    it('test7', function (done) {
        setTimeout(done, 500);
    });
});

//7 Seconds
describe('suite2', function () {
    it('test1', function (done) {
        setTimeout(done, 500);
    });
    it('test2', function (done) {
        setTimeout(done, 1500);
    });
    it('test3', function (done) {
        setTimeout(done, 5000);
    });
});
