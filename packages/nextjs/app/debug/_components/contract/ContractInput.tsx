"use client";

import { Dispatch, SetStateAction } from "react";
import { AbiParameter } from "abitype";
import { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

type ContractInputProps = {
  setForm: Dispatch<SetStateAction<Record<string, any>>>;
  form: Record<string, any> | undefined;
  stateObjectKey: string;
  paramType: AbiParameter;
};

/**
 * Simplified Input component to handle input's based on their function param type
 */
export const ContractInput = ({ setForm, form, stateObjectKey, paramType }: ContractInputProps) => {
  const inputProps = {
    name: stateObjectKey,
    value: form?.[stateObjectKey] || "",
    placeholder: paramType.name ? `${paramType.type} ${paramType.name}` : paramType.type,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(form => ({ ...form, [stateObjectKey]: e.target.value }));
    },
  };

  const renderInput = () => {
    switch (paramType.type) {
      case "address":
        return (
          <input
            {...inputProps}
            type="text"
            className="input input-bordered w-full"
            placeholder="0x..."
          />
        );
      case "string":
        return (
          <input
            {...inputProps}
            type="text"
            className="input input-bordered w-full"
          />
        );
      default:
        // Handle all other types as text input for now
        if (paramType.type.includes("int")) {
          return (
            <input
              {...inputProps}
              type="number"
              className="input input-bordered w-full"
            />
          );
        } else {
          return (
            <input
              {...inputProps}
              type="text"
              className="input input-bordered w-full"
            />
          );
        }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center ml-2">
        {paramType.name && <span className="text-xs font-medium mr-2 leading-none">{paramType.name}</span>}
        <span className="block text-xs font-extralight leading-none">{paramType.type}</span>
      </div>
      {renderInput()}
    </div>
  );
};
