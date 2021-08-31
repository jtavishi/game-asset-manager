import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('sample-harness')
export default class SampleHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
      
        <!-- Registry -->
      
        <action-card title="Registry - Get Auth NFT"
          description="Register a Tenant with the RegistryService to get an AuthNFT" action="receiveAuthNFT" method="post"
          fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="Registry - Has Auth NFT" description="Checks to see if an account has an AuthNFT"
          action="hasAuthNFT" method="get" fields="tenant">
          <account-widget field="tenant" label="Tenant Account">
          </account-widget>
        </action-card>
      
        <action-card title="RegistryGameAssetContract - Get Tenant"
          description="Get an instance of a Tenant from RegistryGameAssetContract to have your own data" action="receiveTenant"
          method="post" fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>

        <!-- Video game asset manager -->
        <action-card title="Tenant (Game Developer) - Add game"
          description="Add game you want to support" action="addGame"
          method="post" fields="signer gameId gameName">
          <account-widget field="signer" label="Account">
          </account-widget>
          <text-widget field="gameId" label="Game ID" placeholder="-brawl-stars"></text-widget>
          <text-widget field="gameName" label="Game Name" placeholder="BrawlStars"></text-widget>
        </action-card>

        <action-card title="Tenant (Game Developer) - Get Games you support"
          description="Get games IDs you support" action="getGamesList"
          method="get" fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>

        <action-card title="User - Setup games collection"
          description="Setup games collection to games assets" action="setUpGamesCollection"
          method="post" fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>

        <action-card title="User - Init collection for a game"
          description="Setup collection for a game you want to mint Assets for" action="setUpGameCollection"
          method="post" fields="signer recipient gameId">
          <account-widget field="signer" label="Tenant Account">
          </account-widget>
          <account-widget field="recipient" label="Recipient Account">
          </account-widget>
          <!--TODO give a dropdown to select game id -->
          <text-widget field="gameId" label="Game ID" placeholder="-brawl-stars"></text-widget>
        </action-card>

        <action-card title="Assets - Mint Asset" description="Mint an asset for a particular game" action="mintAsset"
          method="post" fields="acct recipient gameId assetName assetPower">
          <account-widget field="acct" label="Tenant Account">
          </account-widget>
          <account-widget field="recipient" label="Recipient Account">
          </account-widget>
          <text-widget field="gameId" label="Game ID" placeholder="-brawl-stars"></text-widget>
          <text-widget field="assetName" label="Name of Asset" placeholder="Fire Gun"></text-widget>
          <text-widget field="assetPower" label="Power" placeholder="100"></text-widget>
        </action-card>

        <action-card title="Assets - Get games assets" description="Get list of your owned games assets" action="getAssets" method="get"
          fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>

        <action-card title="Assets - Get asset metadata" description="Get metadata of your game asset" action="getAssetMetadata" method="get"
          fields="acct gameId assetId">
          <account-widget field="acct" label="Account">
          </account-widget>
          <text-widget field="gameId" label="Game ID" placeholder="-brawl-stars"></text-widget>
          <text-widget field="assetId" label="Asset ID" placeholder="0"></text-widget>
        </action-card>

        <action-card title="Assets - Transfer Asset"
          description="Transfer asset from one game to another" action="transferAsset"
          method="post" fields="acct fromGameId assetId toGameId recipient">
          <account-widget field="acct" label="Tenant Account">
          </account-widget>
          <account-widget field="recipient" label="Recipient Account">
          </account-widget>
          <text-widget field="fromGameId" label="From Game ID" placeholder="-brawl-stars"></text-widget>
          <text-widget field="assetId" label="Asset ID" placeholder="0"></text-widget>
          <text-widget field="toGameId" label="To Game ID" placeholder="-free-fire"></text-widget>
        </action-card>

      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
