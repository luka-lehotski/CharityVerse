//src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import Transact2 from './components/Transact2'
import AppCalls from './components/AppCalls'
//import AlgorandService from './utils/AlgorandService'
import './footerstyles.css';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [openDemoModal2, setOpenDemoModal2] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }
  const toggleDemoModal2 = () => {
    setOpenDemoModal2(!openDemoModal2)
  }
  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }
  //const contractABI = require("../contract-abi.json");
  //const contractAddress = "";
  //const algodConfig = getAlgodConfigFromViteEnvironment()

  return (
    <body>
      <header className="header">
        <div className='left-image'>
          <img src="./pic1.png" alt="Organization 1" />
        </div>
        <h1>CharityVerse</h1>
        <div className='right-image'>
          <img src="https://www.disabled-world.com/pics/1/volunteer.png" alt="Organization 2" />
        </div>
      </header >
      <div className="hero min-h-screen bg-teal-400">
        <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
          <div className="max-w-md">
            <h1 className="text-4xl">
              Welcome to <div className="font-bold">CharityVerse</div>
            </h1>
            <p className="py-6">
              Welcome to CharityVerse application. Refer to the resource below to donate to our projects.
            </p>

            <div className="grid">
              <button className="btn m-2" >
                <a href="./projekti.html"> See our projects</a>
              </button>

              <div className="divider" />
              <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
                Connect your wallet:
              </button>

              {/*{activeAddress && (
                <button data-test-id="transactions-demo" className="btn m-2" onClick={toggleDemoModal}>
                  Transactions Demo
                </button>
              )}*/}
              {activeAddress && (
                <button data-test-id="transactions-demo" className="btn m-2" onClick={toggleDemoModal2}>
                  Donate
                </button>
              )}
              {activeAddress && (
                <button data-test-id="appcalls-demo" className="btn m-2" onClick={toggleAppCallsModal}>
                  Contract Interactions Demo
                </button>
              )}
              {/*{activeAddress && (
              <button data-test-id="appcalls-demo" className="btn m-2" onClick={toggleAppCallsModal}>
                <a href="/connect-wallet">Connect Wallet</a>
              </button>
            )}*/}
            </div>

            <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
            <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
            <Transact2 openModal={openDemoModal2} setModalState={setOpenDemoModal2} />

            <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
          </div>

        </div>

      </div>
      <footer>
        <div className="footer-info">Contact Us: charityverse@gmail.com</div>
        <div className="footer-info">Phone: +(381) 111-1111</div>
        <div className="footer-info">Address:  Bulevar Mihajla Pupina 188, Novi Sad, Serbia</div>
      </footer>
    </body >
  )
}

export default Home
