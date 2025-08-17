export type ContractName = "FriendshipBraceletNFT" | "ANewFriendship";

export type ContractAbi = any[];

export interface AbiParameter {
  name: string;
  type: string;
  internalType: string;
  components?: AbiParameter[];
}

export interface AbiParameterTuple extends AbiParameter {
  components: AbiParameter[];
}

export interface GenericContract {
  address: string;
  abi: ContractAbi;
}

export type Contract<TContractName extends ContractName> = GenericContract & {
  contractName: TContractName;
};

export const useScaffoldContract = <TContractName extends ContractName>(
  contractName: TContractName,
): {
  data: Contract<TContractName> | null;
  isLoading: boolean;
  error: Error | null;
} => {
  // This is a simplified version - we'll implement the full logic later
  return {
    data: null,
    isLoading: false,
    error: null,
  };
};
