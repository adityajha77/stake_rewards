import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const ADITYA_TOKEN_SUPPLY = 1_000_000n * 10n**18n; // 1,000,000 ADT with 18 decimals

const AdityaTokenModule = buildModule("AdityaTokenModule", (m) => {
  const adityaToken = m.contract("AdityaToken", [ADITYA_TOKEN_SUPPLY]);

  return { adityaToken };
});

export default AdityaTokenModule;
