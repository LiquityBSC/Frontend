import {
  Contract,
} from "@ethersproject/contracts";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

import PancakeSwapAbi from './abi-json/PancakeSwapAbi.json';
import CakeLpAbi from './abi-json/CakeLpAbi.json';

export const contract_address = {
  pancake: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  cakeLp: '0x36Ac3d907AEeaba437E92c4986125f4Cd0171782',
}

type EthersProvider = Provider;
type EthersSigner = Signer;

export const connectContract = (
  provider: EthersProvider,
  signer: EthersSigner | undefined,
) => {
  const contract = new Contract(contract_address.pancake, PancakeSwapAbi as any, signer ?? provider);
  return contract;
}

export const cakeLpContract = (
  provider: EthersProvider,
  signer: EthersSigner | undefined,
) => {
  const contract = new Contract(contract_address.cakeLp, CakeLpAbi as any, signer ?? provider);
  return contract;
}