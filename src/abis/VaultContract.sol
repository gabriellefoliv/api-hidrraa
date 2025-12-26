// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultContract {
    event PagamentoRecebido(address indexed pagador, uint256 valor, string idPedido);

    function pagar(string memory _idPedido) public payable {
        emit PagamentoRecebido(msg.sender, msg.value, _idPedido);
    }

    function sacar() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}
