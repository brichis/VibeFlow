import { useMemo } from "react";
import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { ContractName, GenericContract } from "~~/utils/scaffold-eth/contract";

export const useScaffoldContract = <TContractName extends ContractName>(
  contractName: TContractName,
): {
  data: Contract<TContractName> | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const { data: deployedContractData, isLoading } = useDeployedContractInfo(contractName);

  const contract = useMemo(() => {
    if (!deployedContractData) return null;
    
    return {
      contractName,
      address: deployedContractData.address,
      abi: deployedContractData.abi,
    } as Contract<TContractName>;
  }, [contractName, deployedContractData]);

  return {
    data: contract,
    isLoading,
    error: null,
  };
};

export type Contract<TContractName extends ContractName> = GenericContract & {
  contractName: TContractName;
};
