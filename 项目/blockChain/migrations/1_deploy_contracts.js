const AdminContract = artifacts.require("AdminContract");
const UserContract = artifacts.require("UserContract");

module.exports = function(deployer) {
  deployer.deploy(AdminContract);
  deployer.deploy(UserContract);
};
