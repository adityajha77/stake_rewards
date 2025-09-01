import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import AdityaTokenModule from "./AdityaToken.js";

const StakingV2Module = buildModule("StakingV2Module", (m) => {
  const { adityaToken } = m.useModule(AdityaTokenModule);
  const initialOwner = m.getAccount(0);

  const stakingV2 = m.contract("StakingV2", [adityaToken, initialOwner]);

  return { stakingV2 };
});

export default StakingV2Module;
