pragma solidity ^0.5.1;

contract Casino {
    uint private prize;
    uint private winnerSeed;

    uint private start;
    uint private buyPeriod = 10;
    uint private verifyPeriod = 5;
    uint private checkPeriod = 5;

    bool private hasWinner;


    mapping(address => uint) _tickets;
    mapping(address => uint) _winners;
    /* address private winner; */

    address[] _entries;
    address[] _verified;

    event evLogInt(string, uint);
    event evLogAddr(string, address);

    constructor ()public {
        start = now;
    }

    function getStartTime() external view returns(uint) {
        return start;
    }

    function unsafeEntry(uint number, uint salt) external payable returns(bool) {
        return buyTicket(generateHash(number, salt));
    }

    function generateHash(uint number, uint salt) public pure returns (uint) {
        require(salt > number, "salt less then number.");
        return uint(keccak256(abi.encodePacked(number + salt)));
    }


    function buyTicket(uint hash) internal returns(bool) {
        require(now < start+buyPeriod);

        emit evLogInt("1)", start);
        emit evLogInt("2)", start+buyPeriod);

        require(msg.value == 1 ether);
        require(_tickets[msg.sender] == 0);

        _tickets[msg.sender] = hash;
        _entries.push(msg.sender);
        /* prize += msg.value; */
        return true;
    }

    function verifyTicket(uint number, uint salt) external returns(bool) {
        require(now >= start+buyPeriod);
        require(now < start+buyPeriod+verifyPeriod);
        require(_tickets[msg.sender] > 0);
        require(generateHash(number, salt) == _tickets[msg.sender]);

        winnerSeed = uint(keccak256(abi.encodePacked(now+winnerSeed, salt, msg.sender)));
        emit evLogInt("a)", winnerSeed);
        _verified.push(msg.sender);

        return true;
    }


    function checkWinner() external returns(bool) {
        require(now >= start+buyPeriod+verifyPeriod);
        require(now < start+buyPeriod+verifyPeriod+checkPeriod);

        address winner;
        uint _pick;
        if(!hasWinner) {
            _pick = winnerSeed % _verified.length;
            winner = _verified[_pick];
            _winners[winner] = _verified.length - 1;
            hasWinner = true;
        }

        emit evLogInt("1)", _pick);
        emit evLogInt("2)", _verified.length);
        emit evLogInt("3)", winnerSeed);
        emit evLogAddr("4)", winner);
        emit evLogInt("5)", _winners[winner]);

        return msg.sender == winner;
    }


    function claim() external {
        require(_winners[msg.sender] > 0);

        uint prizAmount = _winners[msg.sender];
        _winners[msg.sender] = 0;
        msg.sender.transfer(prizAmount * 1 ether);
    }
}
