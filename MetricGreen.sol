// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MetricGreen {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct CarbonCredit {
        string producerName;
        uint256 carbonAmount; 
        bool isRetired;       
    }

    CarbonCredit[] public credits;
    mapping(address => uint256) public reputationBonds; 

    function depositBond() public payable {
        require(msg.value > 0, "Must send some ETH as a bond");
        reputationBonds[msg.sender] += msg.value;
    }

    function mintCredit(string memory _name, uint256 _amount) public {
        require(reputationBonds[msg.sender] > 0, "Stake a bond first");
        credits.push(CarbonCredit(_name, _amount, false));
    }

    function retireCredit(uint256 _index) public {
        require(_index < credits.length, "Invalid credit index");
        require(!credits[_index].isRetired, "Already retired");

        credits[_index].isRetired = true;
    }

    function slashProducer(address _producer) public {
        require(msg.sender == admin, "Only admin can slash");
        reputationBonds[_producer] = 0;
    }

    function getCreditsCount() public view returns(uint) {
        return credits.length;
    }
}
