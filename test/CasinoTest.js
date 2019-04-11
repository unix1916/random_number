const Casino = artifacts.require("./Casino.sol");
// const web3 = require("web3");

contract("Casino", (accounts) => {
    var casino;
    console.log(accounts);
    // Casino.deployed().then(instance => {
    //     casino = instance;
    // });

    describe('Casino contract.', () => {
        before(function(){
            console.log("........depoly()");
            return Casino.deployed().then(function(instance) {
                casino = instance;
                console.log("contract address : ", casino.address);
            });
        });

        it("get start time ", function() {
            return casino.getStartTime.call()
            .then(function(stime) {
                console.log("start time :", stime.toNumber());
            }).catch((error) => {
                console.log(error);
            })
        });

        it("get a ticket.3 users", function() {
            // return casino.unsafeEntry(20, 44, {from : accounts[0], value : toWei(1, "ether")});
            return casino.unsafeEntry(20, 44, {from : accounts[0], value:web3.utils.toWei("1", "ether")})
            .then(() =>{
                return casino.unsafeEntry(30, 56, {from : accounts[1], value:web3.utils.toWei("1", "ether")});
            }).then(() => {
                return casino.unsafeEntry(40, 67, {from : accounts[2], value:web3.utils.toWei("1", "ether")});
            });
        });

        it("timesleep. 30 sec", async() => {
            await timesleep(10000);       // time sleep 30sec
        });

        it("verifyTicket.", async() => {
            return casino.verifyTicket(20, 44, {from: accounts[0]})
            .then(result => {
                console.log("seed 1>>", result.logs[0].args["1"].toString());
                return casino.verifyTicket(30, 56, {from: accounts[1]});
            }).then(result => {
                console.log("seed 2>>", result.logs[0].args["1"].toString());
                return casino.verifyTicket(40, 67, {from: accounts[2]});
            }).then(result => {
                console.log("seed 3>>", result.logs[0].args["1"].toString());
            });
        });

        it("timesleep. 20 sec", async() => {
            await timesleep(5000);       // time sleep 30sec
        });

        it("check winner.", function() {
            return casino.checkWinner({from: accounts[0]})
            .then(result=> {
                 console.log("result 0>>", result.logs[0].args["1"].toNumber());
                 console.log("result 1>>", result.logs[1].args["1"].toNumber());
                 console.log("result 2>>", result.logs[2].args["1"].toString());
                 console.log("result 3>>", result.logs[3].args["1"].toString());
                 console.log("result 4>>", result.logs[4].args["1"].toNumber());
            }).catch(error => {
                return casino.checkWinner({from: accounts[1]})
                .then(result=> {
                    console.log("result 0>>", result.logs[0].args["1"].toNumber());
                    console.log("result 1>>", result.logs[1].args["1"].toNumber());
                    console.log("result 2>>", result.logs[2].args["1"].toString());
                    console.log("result 3>>", result.logs[3].args["1"].toString());
                    console.log("result 4>>", result.logs[4].args["1"].toNumber());
                }).catch(error => {
                    return casino.checkWinner({from: accounts[2]})
                    .then(result=> {
                        console.log("result 0>>", result.logs[0].args["1"].toNumber());
                        console.log("result 1>>", result.logs[1].args["1"].toNumber());
                        console.log("result 2>>", result.logs[2].args["1"].toString());
                        console.log("result 3>>", result.logs[3].args["1"].toString());
                        console.log("result 4>>", result.logs[4].args["1"].toNumber());
                    }).catch(error => {
                        assert.fail("failed check winner.");
                    })
                })
            })
        });

        it("before balance.", function() {
            return web3.eth.getBalance(accounts[0])
            .then(balance => {
                console.log("user1 : ", web3.utils.fromWei(balance, "ether"), balance);
                return web3.eth.getBalance(accounts[1])
            }).then(balance => {
                console.log("user2 : ", web3.utils.fromWei(balance, "ether"), balance);
                return web3.eth.getBalance(accounts[2])
            }).then(balance => {
                console.log("user3 : ", web3.utils.fromWei(balance, "ether"), balance);
            }).catch(console.log);
        });

        it("claim prize.", function() {
            return casino.claim({from: accounts[0]})
            .then(tx => {
                console.log("user1 is winner.");
            }).catch(error => {
                // console.log("user1 is not winner.");
                return casino.claim({from: accounts[1]})
                .then(tx =>{
                    console.log("user2 is winner.");
                }).catch(error => {
                    // console.log("user2 is not winner.");
                    return casino.claim({from: accounts[2]})
                    .then(tx =>{
                        console.log("user3 is winner.");
                    });
                })
            })
        });

        it("after balance.", function() {
            return web3.eth.getBalance(accounts[0])
            .then(balance => {
                console.log("user1 : ", web3.utils.fromWei(balance, "ether"), balance);
                return web3.eth.getBalance(accounts[1])
            }).then(balance => {
                console.log("user2 : ", web3.utils.fromWei(balance, "ether"), balance);
                return web3.eth.getBalance(accounts[2])
            }).then(balance => {
                console.log("user3 : ", web3.utils.fromWei(balance, "ether"), balance);
            }).catch(console.log);
        });

        function timesleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    });

});
