import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy('SBT', {
    from: deployer,
    args: ['Soulbound Token', 'SBT'],
    log: true
  });
};

func.tags = ['SBT'];
export default func;
