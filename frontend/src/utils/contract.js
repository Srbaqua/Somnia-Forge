import { ethers } from "ethers";
import ABI from "./../abi/somniaMemory.json";

export async function getContract(providerOrSigner) {
  const addr = import.meta.env.VITE_CONTRACT_ADDR;
  const signer = providerOrSigner.getSigner ? providerOrSigner.getSigner() : providerOrSigner;
  return new ethers.Contract(addr, ABI, signer);
}
