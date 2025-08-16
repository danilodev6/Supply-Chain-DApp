// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Tracking {
  // This contract is used to track the deployment of other contracts.
  // It can be extended to include more functionality as needed.

  enum ShippingStatus {
    Pending,
    Shipped,
    Delivered,
    Cancelled
  }

  struct Shipment {
    address sender;
    address receiver;
    uint256 pickupTime;
    uint256 deliveryTime;
    uint256 distance;
    bool isPaid;
    ShippingStatus status;
    uint256 price;
  }

  mapping(uint256 => Shipment) public shipments;
  mapping(address => uint256[]) public userShipments;
  uint256 public shipmentCount;

  event ShipmentCreated(
    uint256 indexed shipmentId,
    address indexed sender,
    address indexed receiver,
    uint256 pickupTime,
    uint256 distance,
    uint256 price
  );

  event ShipmentInTransit(address indexed sender, address indexed receiver, uint256 pickupTime);
  event ShipmentDelivered(address indexed sender, address indexed receiver, uint256 deliveryTime);
  event ShipmentPaid(address indexed sender, address indexed receiver, uint256 amount);

  error InsufficientPayment(string message);
  error OnlySender(string message);
  error OnlyReceiver(string message);
  error statusNotPending(string message);
  error statusNotShipped(string message);
  error alreadyPaid(string message);
  error wasNotPaid(string message);

  constructor() {
    shipmentCount = 0;
  }

  function createShipment(address _receiver, uint256 _pickupTime, uint256 _distance, uint256 _price) public {
    shipmentCount++;

    Shipment memory newShipment = Shipment({
      sender: msg.sender,
      receiver: _receiver,
      pickupTime: _pickupTime,
      deliveryTime: 0,
      distance: _distance,
      isPaid: false,
      status: ShippingStatus.Pending,
      price: _price
    });

    shipments[shipmentCount] = newShipment;
    userShipments[msg.sender].push(shipmentCount);

    emit ShipmentCreated(shipmentCount, msg.sender, _receiver, _pickupTime, _distance, _price);
  }

  function payForShipment(uint256 _shipmentId) public payable {
    Shipment storage shipment = shipments[_shipmentId];
    if (msg.sender != shipment.receiver) {
      revert OnlyReceiver("Only the receiver can pay for the shipment");
    }
    if (shipment.isPaid) {
      revert alreadyPaid("Shipment has already been paid for");
    }
    if (msg.value < shipment.price) {
      revert InsufficientPayment("Insufficient payment for shipment");
    }

    shipment.isPaid = true;
    // Money held in contract (escrow)
    emit ShipmentPaid(shipment.sender, shipment.receiver, msg.value);
  }

  function startShipment(uint256 _shipmentId) public {
    Shipment storage shipment = shipments[_shipmentId];
    if (shipment.sender != msg.sender) {
      revert OnlySender("Only the sender can start the shipment");
    }
    if (shipment.status != ShippingStatus.Pending) {
      revert statusNotPending("Shipment is not pending");
    }
    if (!shipment.isPaid) {
      revert wasNotPaid("Shipment has not been paid for");
    }

    shipment.status = ShippingStatus.Shipped;

    emit ShipmentInTransit(shipment.sender, shipment.receiver, shipment.pickupTime);
  }

  function completeShipment(uint256 _shipmentId) public {
    Shipment storage shipment = shipments[_shipmentId];
    if (shipment.receiver != msg.sender) {
      revert OnlyReceiver("Only the receiver can complete the shipment");
    }
    if (shipment.status != ShippingStatus.Shipped) {
      revert statusNotShipped("Shipment is not in transit");
    }

    shipment.status = ShippingStatus.Delivered;
    shipment.deliveryTime = block.timestamp;

    uint256 paymentAmount = shipment.price;
    payable(shipment.sender).transfer(paymentAmount);

    emit ShipmentDelivered(shipment.sender, shipment.receiver, shipment.deliveryTime);
    emit ShipmentPaid(shipment.sender, shipment.receiver, paymentAmount);
  }

  function getShipment(uint256 _shipmentId) public view returns (Shipment memory) {
    return shipments[_shipmentId];
  }

  function getUserShipments(address _user) public view returns (uint256[] memory) {
    return userShipments[_user];
  }

  function getShipmentCountByUser(address _sender) public view returns (uint256) {
    return userShipments[_sender].length;
  }

  function getAllShipments() public view returns (Shipment[] memory) {
    Shipment[] memory allShipments = new Shipment[](shipmentCount);
    for (uint256 i = 1; i <= shipmentCount; i++) {
      allShipments[i - 1] = shipments[i];
    }
    return allShipments;
  }
}
