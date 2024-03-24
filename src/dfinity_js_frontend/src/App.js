import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import "./App.css"; // Assuming this file contains necessary CSS adjustments
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/flight.jpg";
import bgImage from "./assets/img/image.png"; // Import the correct image
import { login, logout as destroy } from "./utils/auth";
import { getDfxAddress, balance as principalBalance } from "./utils/ledger";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import Flights from "./components/flight-reservation/Flights";

const App = function AppWrapper() {
  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principalText;

  const [balance, setBalance] = useState("0");
  const [address, setAddress] = useState("0");

  const getBalance = useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  }, []);

  const getAddress = useCallback(async () => {
    if (isAuthenticated) {
      setAddress(await getDfxAddress());
    }
  }, []);

  useEffect(() => {
    getBalance();
    getAddress();
  }, [getBalance, getAddress]);

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`, // Use the imported image variable
        backgroundRepeat: "no-repeat", // Consider adjusting repetition
        backgroundSize: "cover", // Consider adjusting size
        height: "100vh",
      }}
    >
      <>
        <Notification />
        {isAuthenticated ? (
          <Container fluid="md">
            <Nav className="justify-content-end pt-3 pb-5">
              <Nav.Item>
                <Wallet
                  principal={principal}
                  dfxAddress={address}
                  balance={balance}
                  symbol={"ICP"}
                  isAuthenticated={isAuthenticated}
                  destroy={destroy}
                />
              </Nav.Item>
            </Nav>
            <main>
              <Flights fetchBalance={getBalance} />
            </main>
          </Container>
        ) : (
          <Cover
            name={"Safe Deals With Flights"}
            login={login}
            coverImg={coverImg}
          />
        )}
      </>
    </div>
  );
};

export default App;
