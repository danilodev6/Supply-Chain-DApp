import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Tracking contract...");

  const Tracking = await ethers.getContractFactory("Tracking");
  const tracking = await Tracking.deploy();
  await tracking.waitForDeployment();

  // Using target instead of getAddress()
  console.log("Tracking contract deployed to:", tracking.target);

  const [deployer] = await ethers.getSigners();
  console.log("Contract deployed by:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
