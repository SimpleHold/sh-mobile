import { Linking } from "react-native";

// Lib
import { SimpleHoldCommand, Request, GetWalletsRequest } from "./lib/commands";
import { SimpleHoldError } from "./lib/errors";

type TWallet = {
  address: string;
  symbol: string;
  tokenChain?: string;
};

class SimpelHoldWallet {
  callbackScheme: string;
  callbackId = new Date().getTime();
  app = {
    name: "SimpleHold",
    scheme: "simplehold://",
  };
  resolvers: { [key: string]: (value: string) => void } = {};
  rejectors: { [key: string]: (value: Object) => void } = {};

  constructor(callbackScheme: string) {
    this.callbackScheme = callbackScheme;

    this.start();
  }

  public start() {
    Linking.addEventListener("url", this.handleOpenURL.bind(this));
  }

  public cleanup() {
    Linking.removeEventListener("url", this.handleOpenURL.bind(this));

    this.resolvers = {};
  }

  public installed(): Promise<boolean> {
    const testUrl = this.app.scheme + SimpleHoldCommand.getWallets;

    return Linking.canOpenURL(testUrl);
  }

  public requestWallets(): Promise<TWallet[]> {
    const request = new GetWalletsRequest(
      this.genId("wallets_"),
      this.callbackScheme
    );

    return this.sendRequest(request).then((result) => {
      return JSON.parse(result);
    });
  }

  private genId(prefix?: string): string {
    this.callbackId++;

    return (prefix || "") + this.callbackId;
  }

  private sendRequest(request: Request): Promise<string> {
    return this.installed().then((result) => {
      return new Promise<string>((resolve, reject) => {
        if (result) {
          if (request.callbackScheme.length <= 0) {
            request.callbackScheme = this.callbackScheme;
          }

          this.resolvers[request.id] = resolve;
          this.rejectors[request.id] = reject;

          Linking.openURL(SimpleHoldCommand.getURL(request));
        } else {
          reject({
            error: SimpleHoldError.notInstalled,
            message: SimpleHoldError.toString(SimpleHoldError.notInstalled),
          });
        }
      });
    });
  }

  private handleOpenURL(event: { url: string }) {
    const response = SimpleHoldCommand.parseURL(event.url);

    const resolver = this.resolvers[response.id];
    const rejector = this.rejectors[response.id];

    if (!resolver || !rejector) {
      return;
    }

    if (response.error !== SimpleHoldError.none) {
      rejector({
        error: response.error,
        message: SimpleHoldError.toString(response.error),
      });
    } else {
      resolver(response.result);
    }
    delete this.resolvers[response.id];
    delete this.rejectors[response.id];
  }
}

export default SimpelHoldWallet;
