import conf from '../../conf/index.js'

describe('staleElementRetry', () => {
    describe('basic command', () => {
        it('does not throw staleElementReference exception when getting visibility of elements rapidly removed from DOM', async function () {
            let iterations = 100
            await this.client.url(conf.testPage.staleTest)
            console.log(await this.client.getTitle())
            while (iterations--) {
                console.log(iterations)
                expect(await this.client.isVisible('.staleElementContainer1 .stale-element-container-row')).to.be.true
                // await this.client.isVisible('.staleElementContainer1 .stale-element-container-row')
            }
        })
    })

    describe.skip('custom command', () => {
        before(async function() {
            await this.client.url(conf.testPage.staleTest)
        })

        it('does not throw staleElementReference exception when waiting for element to become invisible but which is removed from DOM in a custom command', async function () {
            this.client.addCommand('waitForVisibleInParallel', function async () {
                const promises = []
                for (let i = 1; i <= 8; i++) {
                    promises.push(this.client.waitForVisible('.staleElementContainer2 .stale-element-container-row-' + i, 10000, true))
                }

                return Promise.all(promises)
                .then(function (results) {
                    results.map(function (result) {
                        result.should.be.true
                    })
                })
            })

            this.client.waitForVisibleInParallel()
            throw Error("not currently working, as the Promise.all() doesn't seem to wait for the commands to execute")
        })
    })
})