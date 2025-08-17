import { useMemo } from "react";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { deployedContracts } from "~~/utils/scaffold-eth/contractsData";

type DeployedContractData<TContractName extends ContractName> = {
  data: any | undefined;
  isLoading: boolean;
};

/**
 * Simplified hook to get deployed contract info
 */
export function useDeployedContractInfo<TContractName extends ContractName>(
  contractName: TContractName,
): DeployedContractData<TContractName> {
  const contractData = useMemo(() => {
    const contracts = deployedContracts.localhost;
    return contracts[contractName];
  }, [contractName]);

  return {
    data: contractData,
    isLoading: false,
  };
}
