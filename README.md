# Supply Chain DApp

**A blockchain-based supply chain DApp for tracking and managing products transparently and securely.**

---

# Screen Shots
![Home Page](./frontend/public/project2-1.png)

![Create Product Page](./frontend/public/project2-2.png)

![Payment Page](./frontend/public/project2-3.png)

## Overview

This project is a decentralized application (DApp) that allows users to track products through the supply chain. It ensures transparency and security by leveraging smart contracts on Ethereum-compatible networks.  

The project consists of two main parts:  

1. **Frontend:** Built with **Next.js 15+** and **Bun** for package management and fast development.  
2. **Smart Contracts:** Written in **Solidity**, with deployment scripts and tests using **Hardhat**.  

---

## Smart Contracts

- **Tracking.sol** – Main contract for product tracking and supply chain events.  
- Located in: `/contracts/contracts/Tracking.sol`  
- Deployment script: `/contracts/scripts/deploy.ts`  
- Tests are in `/contracts/test`  

---

## Frontend

- Built with **Next.js 15+** (App Router) and **Bun**.  
- Structure highlights:
  - `app/` – Pages and layouts for routing.  
  - `components/` – Reusable UI components (Navbar, forms, cards, etc.).  
  - `constants/` – Contract address and ABI configuration.  

---

## Installation

### Backend (Contracts)

```bash
cd contracts
bun install    # or npm install
bun run deploy # deploy contracts using Hardhat
