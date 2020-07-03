import mocha from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
chai.use(promised);


describe('learning about mocha', function() {
    it ('check properties on object', async function() {

        const f = async () => {
            return {
                InternalID: 0,
                Title: '2', 
                Name: '3'    
            }
        } 

        return Promise.all([
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2'
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2'
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '3'
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2'
            }),
        ]);
    })

    it ('check properties on object', function() {

        const res  = [{
            InternalID: 0,
            Title: '2', 
            Name: '3'    
        }]
        expect(res).to.be.an('array')
            .with.lengthOf(1)
        expect(res[0]).to.include({
            InternalID: 0,
            Title: '2'
        }),
    })
})