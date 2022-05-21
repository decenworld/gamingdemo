import React, {useRef, useEffect, useMemo } from 'react';
import Page from '../../components/Page';

import CashImage from '../../assets/img/example.gif';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useBurned2SHARES from '../../hooks/useBurned2SHARES.js';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';
import kyc from '../../assets/img/kyc.png';
import audit from '../../assets/img/audit.jpg';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import PitImage from '../../assets/img/map.png';
import House from '../../assets/img/house.png';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';
import ScrollContainer from 'react-indiana-drag-scroll';
import Npc from '../../assets/img/npc.gif';
import { Section, useScrollIntoView } from "../../hooks/useScrollIntoView";

import mapMovement from "../../hooks/mapMovement";



// Import custom css
import "./styless.css";


const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
  card: {
    borderRadius: 0,
    backgroundColor: '#2c3e50',
    color: theme.palette.primary.contrastText,
    boxShadow: 'none',
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('MVDOLLAR-USDC-LP');
  const tShareFtmLpStats = useLpStats('MSHARE-USDC-LP');
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();
  //const { balance } = useBurned2SHARES();
  const container = useRef(null);
  const [scrollIntoView] = useScrollIntoView();

  let tomb;
  let tShare;
 
  tomb = tombProd;
  tShare = tShareProd;
  
    useEffect(() => {
    // Start with crops centered
    // if (showGame) {
    scrollIntoView(Section.House, "auto");
    // }
  }, [scrollIntoView], []);

    useEffect(() => {
    mapMovement.addListeners(container.current);
    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);


  const buyTombAddress = 'https://spookyswap.finance/swap?outputCurrency=0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae'
  const buyTShareAddress = 'https://spookyswap.finance/swap?outputCurrency=' + tShare.address;

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);

  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: '2OMB-FTM-LP' });
  const tshareLpZap = useZap({ depositTokenName: '2SHARE-FTM-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
  `;

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'2OMB-FTM-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'2SHARE-FTM-LP'}
    />,
  );

  return (
    <Page>
    
      <Grid container spacing={3}>
      <ScrollContainer
          style={{height:"1800px"}}
          vertical={true}
          horizontal={true}
          hideScrollbars={true}
          innerRef={container}
     
        >
          <div
            className="relative h-gameboard w-gameboard"
            // TODO dynamic game board size based on tile dimensions
          >
 
            <img src={PitImage} className="absolute inset-0 w-full h-full" />


            <span className='bg-brown-200 p-1 fixed top-2 right-2 z-50 flex items-center shadow-lg cursor-pointer'
            style={{border: "solid", borderWidth: "3px", marginRight: "10px",  
            imageRendering: "pixelated", borderRadius: "10px"}}

            >
              100 Catcoins
            </span>



            <span id="house" className='house' style={{position: "absolute", top: "1400px", left: "1500px"}}>
              Crypto Wormz HD
            <a href='./cryptowormzhd'>
            <img src={House} width="200" height="250" className="inset-0"  />
            </a>
            </span>

                <span id="house" className='house' style={{position: "absolute", top: "1400px", left: "1800px"}}>
              Crypto Wormz HD
            <a href='./cryptowormzhd'>
            <img src={Npc} width="100" height="150" className="inset-0"  />
            </a>
            </span>    




          </div>
          
        </ScrollContainer>
      </Grid>
    </Page>
  );
};

export default Home;
