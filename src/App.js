import React, { useState, useEffect } from "react";
import { BladeConnector, ConnectorStrategy } from '@bladelabs/blade-web3.js';
import { HederaNetwork } from '@bladelabs/blade-web3.js';
import axios from 'axios';
import swal from 'sweetalert';
const {
  TokenInfoQuery,
  AccountBalanceQuery
} = require("@hashgraph/sdk");

const App = () => {

  const [accountId, setAccountId] = useState("");
  const [userNFT, setUserNFT] = useState({
    id: "#",
    name: "OneTo11 Champions",
    image: "images/1.png"
  });

  const tokenId = "0.0.3856628";


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/nfts`);
        // const sortedData =response.filter((item, i) =>  item.tokenId === "27832783409854");
        console.log("response", response.data.nfts);
        const base64String = response.data.nfts[0].metadata;
        const decodedString = atob(base64String);
        console.log("decodedString", decodedString);

        const ipfsResponse = await axios.get(decodedString);
        console.log("ipfsResponse", ipfsResponse);

        setUserNFT({
          id: response.data.nfts[0].serial_number,
          name: ipfsResponse.data.name,
          image: ipfsResponse.data.image
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [accountId]); // Trigger the effect whenever accountId changes


  // Connect blade wallet
  const connectWallet = async () => {
    const bladeConnector = await BladeConnector.init(
      ConnectorStrategy.EXTENSION, // preferred strategy is optional 
      { // dApp metadata options are optional, but are highly recommended to use
        name: "OneTo11",
        description: "OneTo11",
        url: "https://awesome-dapp.io/",
        icons: ["some-image-url.png"]
      }
    );

    // params are optional, and Mainnet is used as a default
    const params = {
      network: HederaNetwork.Testnet,
      dAppCode: "OneTo11" // optional while testing, request specific one by contacting us
    }

    const pairedAccountIds = await bladeConnector.createSession(params);
    console.log("pairedAccountIds", pairedAccountIds);
    // retrieving the first available signer to perform all the Hedera operations
    const bladeSigner = await bladeConnector.getSigners()[0];


    if (pairedAccountIds.length) {
      console.log(pairedAccountIds[0]);
      setAccountId(pairedAccountIds[0]);
      // setTimeout(function(){
      //   handleFetch();
      // },2000)

    }
  }


  /// claim your NFT 
  const claimNFT = () => {

    if (accountId === 0) {
      swal({ title: "Connect your wallet!", icon: "success", background: "#808080", timer: 2000 });
    }

    var data = { "walletAddress": accountId };

    var config = {
      method: 'post',
      url: `http://prodapi.arcagames.com/server/wallet/claimNFT`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        if (response.data.rs !== 1)
          swal({ title: response.data.error, icon: "error", background: "#808080", timer: 2000 });
        else
          swal({ title: response.data.error, icon: "success", background: "#808080", timer: 2000 });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  const handleFetch = async () => {
    try {
      console.log("accountId", accountId);
      const response = await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/nfts`)
      console.log("response", response.data.nfts);

      // const sortedData =response.filter((item, i) =>  item.tokenId === "27832783409854");
      const base64String = response.data.nfts[0].metadata;
      const decodedString = atob(base64String);
      console.log("decodedString", decodedString);

      const ipfsResponse = await axios.get(decodedString);
      console.log("ipfsResponse", ipfsResponse);

      setUserNFT({
        id: response.data.nfts[0].serial_number,
        name: ipfsResponse.data.name,
        image: ipfsResponse.data.image
      });

    }
    catch (error) {

    }
  }


  return (
    <>
      <div className="page_wrap">
        <header className="web_head">

          <div className="logo">
            <img src="images/logo_color.png" alt="" />
          </div>
          <div className="connect_btn">
            <button className="btn" onClick={connectWallet}>{accountId ? accountId : "Connect"}</button>
          </div>

        </header>

        <section className="nft_wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="claim_dtls">
                  <div className="claim_head">
                    <div className="cl_rgt">
                      <span>{userNFT.id}</span>
                      <div className="cl_nme">
                        <h4>{userNFT.name}</h4>
                        {/* <p>70 HAIL BASIN RD, POWELL, WYOMING</p> */}

                      </div>

                    </div>
                    {/* <div className="cl_lft">
                      <p>To Claim <a href="#">Connect Your wallet</a></p>
                    </div> */}
                  </div>
                  <div className="clam_b">
                    <img src={userNFT.image} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="nft_dtls_wrap">
                  <button className="btn" onClick={claimNFT}>Claim NFTs</button>
                  <div className="nft_dtls">
                    <div className="nft_dts_bx">
                      <div className="nft_l">
                        <span>TOTAL NFTS</span>
                        <p>0/8072</p>
                      </div>
                      <div className="nft_icon">
                        <img src="images/pine.png" alt="" />
                      </div>
                    </div>
                    <div className="nft_dts_bx">
                      <div className="nft_l">
                        <span>TOTAL NFTS</span>
                        <p>0/8072</p>
                      </div>
                      <div className="nft_icon">
                        <img src="images/pine.png" alt="" />
                      </div>
                    </div>
                    <div className="nft_dts_bx">
                      <div className="nft_l">
                        <span>TOTAL NFTS</span>
                        <p>0/8072</p>
                      </div>
                      <div className="nft_icon">
                        <img src="images/pine.png" alt="" />
                      </div>
                    </div>
                    <div className="nft_dts_bx">
                      <div className="nft_l">
                        <span>TOTAL NFTS</span>
                        <p>0/8072</p>
                      </div>
                      <div className="nft_icon">
                        <img src="images/pine.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
