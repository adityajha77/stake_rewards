import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import AdityaTokenModule from "./AdityaToken.js";

const StakingModule = buildModule("StakingModule", (m) => {
  const { adityaToken } = m.useModule(AdityaTokenModule);
  const owner = m.getAccount(0); // Deployer will be the owner

  const staking = m.contract("Staking", [adityaToken, owner]);

  return { staking };
});

export default StakingModule;
