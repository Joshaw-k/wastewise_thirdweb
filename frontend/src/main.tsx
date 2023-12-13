import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { App } from "./App";
import { config } from "./wagmi";
import WastewiseProvider from "./context";
// import "./satoshi.css";
import "./index.css";
import { Sepolia } from "@thirdweb-dev/chains";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider
      supportedWallets={[metamaskWallet()]}
      supportedChains={[Sepolia]}
      activeChain={Sepolia}
      clientId="f53e5adc4f3acda7e5b18385372bc90c"
    >
      <WastewiseProvider>
        <App />
      </WastewiseProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
