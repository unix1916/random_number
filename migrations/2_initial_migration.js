const Casino = artifacts.require("Casino");

module.exports = function(deployer) {
  deployer.deploy(Casino).then(function(){
      console.log("Casino deploy.", Casino.address);
  })
};
