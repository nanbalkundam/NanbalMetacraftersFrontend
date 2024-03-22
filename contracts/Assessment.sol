// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    struct Data {
        uint256 id;
        string name;
    }

    Data[] private _data;

    function setValue(uint256 id, string memory newName) public {
        bool exists = false;
        for (uint256 i = 0; i < _data.length; i++) {
            if (_data[i].id == id) {
                _data[i].name = newName;
                exists = true;
                break;
            }
        }
        if (!exists) {
            _data.push(Data(id, newName));
        }
    }

    function getName(uint256 id) public view returns (string memory) {
        for (uint256 i = 0; i < _data.length; i++) {
            if (_data[i].id == id) {
                return _data[i].name;
            }
        }
        revert("Value not found");
    }

    function getDataCount() public view returns (uint256) {
        return _data.length;
    }

    function getDataAtIndex(uint256 index) public view returns (uint256 id, string memory name) {
        require(index < _data.length, "Index out of bounds");
        return (_data[index].id, _data[index].name);
    }
}
