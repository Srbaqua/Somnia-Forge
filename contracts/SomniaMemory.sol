// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SomniaMemory {
    struct Memory {
        address player;
        string npcName;
        string memoryText;
        uint256 timestamp;
    }

    Memory[] public memories;

    event MemoryAdded(uint256 indexed id, address indexed player, string npcName, string memoryText, uint256 timestamp);

    function createMemory(string calldata npcName, string calldata memoryText) external {
        memories.push(Memory({
            player: msg.sender,
            npcName: npcName,
            memoryText: memoryText,
            timestamp: block.timestamp
        }));
        uint256 id = memories.length - 1;
        emit MemoryAdded(id, msg.sender, npcName, memoryText, block.timestamp);
    }

    function getMemory(uint256 id) public view returns (Memory memory) {
        return memories[id];
    }

    function getMemoriesCount() public view returns (uint256) {
        return memories.length;
    }

    // Return memories for a player (simple iteration; fine for demo/testnet)
    function getMemoriesForPlayer(address player) public view returns (Memory[] memory) {
        uint256 total = memories.length;
        uint256 count = 0;
        for (uint256 i = 0; i < total; i++) {
            if (memories[i].player == player) {
                count++;
            }
        }
        Memory[] memory result = new Memory[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < total; i++) {
            if (memories[i].player == player) {
                result[idx] = memories[i];
                idx++;
            }
        }
        return result;
    }
}
