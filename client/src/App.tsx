import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";


function App() {
  const currentAccount = useCurrentAccount();
  console.log(currentAccount);
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
          <ConnectButton />
          {currentAccount ? <div>ağır yaşamlar</div> : (
            <Heading>Please connect your wallet</Heading>
          )}
    </>
  );
}

export default App;
