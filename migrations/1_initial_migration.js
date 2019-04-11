const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations).then(function(){
      console.log("migration deploy.", Migrations.address);
  })
};
