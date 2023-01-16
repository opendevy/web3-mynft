import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import {
  setWeb3Connected,
  setMetaMask,
  setSigner,
  setProvider,
  setWeb3Object,
} from "../redux/actions/web3action";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  Spinner,
  Grid,
  GridItem,
  Center,
} from "@chakra-ui/react";
import { Network, Alchemy } from "alchemy-sdk";

type nftData = {
  assetId: string;
  contractType: string;
  holder: string;
  balance: number;
  fileType: string;
  collectionAddress: string;
  name: string;
  file?: string;
  description?: string;
  cover?: string;
  externalLink: string;
};
export default function Home() {
  const dispatch = useDispatch();
  const isWeb3Connected = useSelector((state: any) => state.web3.web3connected);
  const metaMaskAddress = useSelector(
    (state: any) => state.web3.metaMaskAddress
  );
  const provider = useSelector((state: any) => state.web3.provider);
  const web3Modal = useSelector((state: any) => state.web3.web3object);
  const [buttonText, setButtonText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<any | null>(null);
  const [pageKey, setPageKey] = useState<any | null>("");

  const signIn = async (account: string, signer: any) => {
    const signature = await signer.signMessage(`I am connecting my wallet`);
    return signature;
  };

  const getNFTs = async (ownerAddress: string, pageKey: string) => {
    try {
      setIsLoading(true);
      const settingsEth = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_ETH,
        network: Network.ETH_GOERLI,
      };

      const service = {
        alchemy: new Alchemy(settingsEth),
      };

      const nftData = await service.alchemy.nft.getNftsForOwner(ownerAddress, {
        pageKey,
      });
      // console.log("nfts", JSON.stringify(nftData));

      const nfts = nftData.ownedNfts;
      if (nfts.length == 0) {
        setNfts([]);
        setIsLoading(false);
      } else {
        const tempNFTs: nftData[] = [];

        for (let i = 0; i < nfts.length; i++) {
          const nft = nfts[i];
          // console.log("nft ", nft);

          if (nft.metadataError) {
            // console.log("nft.metadataError", nft.metadataError);
          } else {
            const nftObj = {
              assetId: nft.tokenId,
              contractType: nft.contract.tokenType,
              holder: ownerAddress.toLowerCase(),
              balance: nft.balance > 0 ? nft.balance : 1,
              fileType: "image/jpeg",
              collectionAddress: nft.contract.address,
              name: nft?.rawMetadata?.name
                ? nft?.rawMetadata?.name
                : nft.tokenId,
              file: nft?.rawMetadata?.file
                ? nft.rawMetadata.file.replace("ipfs://", "https://ipfs.io/")
                : nft?.rawMetadata?.image
                ? nft?.rawMetadata?.image.replace("ipfs://", "https://ipfs.io/")
                : "",
              description: nft?.rawMetadata?.description
                ? nft?.rawMetadata?.description
                : "",
              cover: nft?.rawMetadata?.cover
                ? nft.rawMetadata.cover.replace("ipfs://", "https://ipfs.io/")
                : nft?.rawMetadata?.image
                ? nft.rawMetadata.image.replace("ipfs://", "https://ipfs.io/")
                : "",
              externalLink: nft?.rawMetadata?.external_url
                ? nft.rawMetadata.external_url
                : "",
            };

            tempNFTs.push(nftObj);
          }
        }
        setPageKey(nftData?.pageKey);
        setNfts(tempNFTs);
        setIsLoading(false);
      }
    } catch (exception) {
      setIsLoading(false);
      console.log("exception", exception);
    }
  };

  const connectWallet = async () => {
    const providerOptions = {
      /* See Provider Options Section */
    };

    const _web3Modal = new Web3Modal({
      network: "goerli", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const instance = await _web3Modal.connect();
    dispatch(setWeb3Object(_web3Modal));

    const provider = new ethers.providers.Web3Provider(instance);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const account = await signer.getAddress();

    const accessToken = localStorage.getItem("tokenKey");
    if (!accessToken) {
      const data = await signIn(account, signer);
      localStorage.setItem("tokenKey", data);
      dispatch(setMetaMask(account));
      dispatch(setWeb3Connected(true));
      dispatch(setSigner(signer));
      dispatch(setProvider(provider));
    } else {
      dispatch(setMetaMask(account));
      dispatch(setWeb3Connected(true));
      dispatch(setSigner(signer));
      dispatch(setProvider(provider));
    }
  };

  const connectClick = () => {
    console.log("connectClick");
    if (!isWeb3Connected) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  };

  const disconnectWallet = async () => {
    web3Modal.clearCachedProvider();
    localStorage.removeItem("tokenKey");
    dispatch(setWeb3Connected(false));
    dispatch(setMetaMask(""));
    setNfts([]);
  };

  useEffect(() => {
    console.log("isWeb3Connected", isWeb3Connected);
    console.log("metaMaskAddress", metaMaskAddress);
    if (isWeb3Connected) {
      setButtonText("Disconnect Wallet");
      getNFTs(metaMaskAddress, "");
    } else {
      setButtonText("Connect Wallet");
    }
  }, [isWeb3Connected, metaMaskAddress]);

  useEffect(() => {
    console.log("nfts", nfts);
  }, [nfts]);

  return (
    <>
      <main className="main">
        <Button
          onClick={() => connectClick()}
          colorScheme="blue"
          marginLeft={20}
          marginTop={20}
        >
          {buttonText}
        </Button>

        {isLoading && (
          <Button
            colorScheme="blue"
            marginLeft={20}
            marginTop={20}
            disabled={!isWeb3Connected}
          >
            <Spinner />
          </Button>
        )}

        <Text marginLeft={20} marginTop={10}>
          {metaMaskAddress}
        </Text>
        <Center h="100%" color="white">
          {nfts?.length ? (
            <Grid templateColumns="repeat(3, 1fr)" gap={6} w="80%">
              {nfts?.map((nft: nftData) => (
                <GridItem key={nft.assetId} w="100%" h="400" bg="blue.500">
                  <img
                    style={{ height: "300px" }}
                    width={"100%"}
                    src={nft.cover}
                    alt={nft.name}
                  />
                  <Text marginLeft={10}>{`Type: ${nft.contractType}`}</Text>
                  <Text marginLeft={10}>{`Name: ${nft.name}`}</Text>
                  <Text marginLeft={10}>{`Balance: ${nft.balance}`}</Text>
                  {nft.description && (
                    <Text
                      marginLeft={10}
                    >{`Description: ${nft.description}`}</Text>
                  )}
                </GridItem>
              ))}
            </Grid>
          ) : (
            <>
              {isWeb3Connected && !isLoading && (
                <Text color="blue.500">No valid NFT found.</Text>
              )}
            </>
          )}
        </Center>
      </main>
    </>
  );
}
