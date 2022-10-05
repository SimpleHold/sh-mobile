import URL from "url-parse";
import { SimpleHoldError } from "./errors";

export enum SimpleHoldCommand {
  getWallets = "sdk_get_wallets",
}

export namespace SimpleHoldCommand {
  export function parseURL(urlString: string): {
    id: string;
    result: string;
    error: string;
  } {
    const url = URL(urlString, "", true);
    const id = url.query.id || "";
    let error = "" + SimpleHoldError.invalidResponse;
    let result = "";
    if (!id) {
      return { id, result, error };
    }
    error = url.query.error || SimpleHoldError.none;
    if (id.startsWith("wallets_")) {
      result = url.query.wallets || "";
    }
    return { id, result, error };
  }

  export function getURL(
    request: Request,
    scheme: string = "simplehold://"
  ): string {
    let query = processQuery(request.toQuery());
    var msgUrl = URL(scheme + request.command + "?" + query);
    return msgUrl.toString();
  }

  export function processQuery(query: QueryItem[]): string {
    return query
      .map((pair) => {
        return pair.k + "=" + pair.v;
      })
      .join("&");
  }
}

export interface Request {
  id: string;
  command: string;
  callbackScheme: string;
  callbackPath: string;
  toQuery(): QueryItem[];
}

class QueryItem {
  k: string;
  v: string;
  constructor(k: string, v: string) {
    this.k = k;
    this.v = v;
  }
}

export class GetWalletsRequest implements Request {
  id: string;
  command: string = SimpleHoldCommand.getWallets;
  callbackScheme: string;
  callbackPath: string;

  constructor(
    callbackId: string,
    callbackScheme?: string,
    callbackPath?: string
  ) {
    this.callbackScheme = callbackScheme || "";
    this.callbackPath = callbackPath || SimpleHoldCommand.getWallets;
    this.id = callbackId;
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = [];

    if (this.callbackScheme.length > 0) {
      array.push({ k: "app", v: this.callbackScheme });
      array.push({ k: "callback", v: this.callbackPath });
    }
    array.push({ k: "id", v: this.id });
    return array;
  }
}
