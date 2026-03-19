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
    mapping(address => string) public registryCertificates;
    mapping(address => bool) public isRegistered;

    function registerCertificate(string memory _certId) public {
        require(bytes(_certId).length > 0, "Invalid certificate ID");
        registryCertificates[msg.sender] = _certId;
        isRegistered[msg.sender] = true;
    }

    function mintCredit(string memory _name, uint256 _amount) public {
        require(isRegistered[msg.sender], "Must register with a certificate first");
        credits.push(CarbonCredit(_name, _amount, false));
    }

    function retireCredit(uint256 _index) public {
        require(_index < credits.length, "Invalid credit index");
        require(!credits[_index].isRetired, "Already retired");

        credits[_index].isRetired = true;
    }

    function revokeCertificate(address _producer) public {
        require(msg.sender == admin, "Only admin can revoke");
        isRegistered[_producer] = false;
        registryCertificates[_producer] = "";
    }

    function getCreditsCount() public view returns(uint) {
        return credits.length;
    }
}
