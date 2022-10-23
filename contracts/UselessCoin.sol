// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UselessCoin is ERC20, Ownable {
    uint256 constant _integer = 1000000000000000000;
    uint256 public waitMintAmount; // 管理员可mint数量

    bool public enableClaim; // 是否可claim
    uint256 private _claimAmount;
    mapping(address => uint256) private _claimer;
    uint public claimCount;

    constructor() ERC20("Useless Coin", "UC") {
        waitMintAmount = 10000000 * _integer;
        enableClaim = true;
        _claimAmount = (2 ** 10) * 100 * _integer;
        claimCount = 0;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(amount <= waitMintAmount, "Max mint amount");
        waitMintAmount = waitMintAmount - amount;
        _mint(to, amount);
    }

    function claim() external {
        require(enableClaim, "Disable claim");
        require(_claimer[msg.sender] == 0, "Already claimed");

        _mint(msg.sender, _claimAmount);

        _claimer[msg.sender] = _claimAmount;
        claimCount = claimCount + 1;
        // 没1k用户，可claim数减半
        if (claimCount % 1000 == 0) {
            _claimAmount = _claimAmount / 2;
            // 可claim数 小于100后不可claim
            if (_claimAmount < 100 * _integer) {
                enableClaim = false;
            }
        }
    }

    function isClaimed(address addr) external view returns (string) {
        if (_claimer[addr] > 0) {
            return true;
        }
        return false;
    }
}
