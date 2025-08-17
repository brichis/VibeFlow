# VibeFlow

**Find your tribe, verify your vibe.**

VibeFlow is a social network for event-based networking that solves the adult friendship crisis by connecting people with genuinely shared interests, verified through actual event attendance.

## The Problem

67% of millennials and Gen Z report feeling lonely despite being more "connected" than ever. Traditional social networks optimize for engagement, not genuine connection. People attend events hoping to meet like-minded individuals but struggle to convert brief encounters into lasting relationships.

## The Solution
=======
![demo Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

VibeFlow analyzes your Eventbrite event history to match you with people who've proven their interests through real-world participation. No more "loves hiking" profiles from couch potatoes—only authentic connections based on verified shared experiences.

## Key Features

- **Interest Verification**: Connects with Eventbrite to analyze actual event attendance
- **Smart Matching**: Algorithm identifies "event twins" with compatible participation patterns  
- **Event-Centric Discovery**: Find connections before, during, or after events
- **Digital Friendship Bracelets**: NFTs to commemorate meaningful connections
- **Privacy-First**: No public browsing of profiles without mutual interest

## Architecture
vibeflow/
├── frontend/           # Next.js web application
├── backend/            # Express.js API server
├── contracts/          # Smart contracts (Flow blockchain)
├── shared/             # Shared utilities and types
└── docs/              # Documentation

## Technology Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui

**Backend:** Node.js, Express.js, Eventbrite API, Dynamic wallet auth

**Blockchain:** Flow blockchain, Cadence smart contracts, NFT friendship bracelets

## Target Users

- **Professionals (25-45)**: Conference attendees seeking authentic networking
- **Life Transitioners**: People relocating or changing careers  
- **Hobby Enthusiasts**: Active participants wanting deeper connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

MIT License - see LICENSE file for details.
=======
4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `demo Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contracts in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`

## 🚀 Setup ERC-721 NFT Extension

This extension introduces an ERC-721 token contract and demonstrates how to use it, including getting the total supply and holder balance, listing all NFTs from the collection and NFTs from the connected address, and how to transfer NFTs.

The ERC-721 Token Standard introduces a standard for Non-Fungible Tokens ([EIP-721](https://eips.ethereum.org/EIPS/eip-721)), in other words, each token is unique.

The ERC-721 token contract is implemented using the [ERC-721 token implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) from OpenZeppelin.

The ERC-721 token implementation uses the [ERC-721 Enumerable extension](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol) from OpenZeppelin to list all tokens from the collection and all the tokens owned by an address. You can remove this if you plan to use an indexer, like a Subgraph or Ponder ([extensions available](https://scaffoldeth.io/extensions)).

### Setup

Deploy your contract running ```yarn deploy```

### Interact with the NFT

Start the front-end with ```yarn start``` and go to the _/erc721_ page to interact with your deployed ERC-721 token.

You can check the code at ```packages/nextjs/app/erc721```.


## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.