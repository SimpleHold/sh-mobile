export enum SimpleHoldError {
  none = "none",
  notInstalled = "app_not_installed",
  unknown = "unknown",
  rejectedByUser = "rejected_by_user",
  invalidResponse = "invalid_response",
}

export namespace SimpleHoldError {
  export function toString(error: SimpleHoldError | string): string {
    switch (error) {
      case SimpleHoldError.unknown:
        return "Unknown Error";
      case SimpleHoldError.none:
        return "No Error";
      case SimpleHoldError.rejectedByUser:
        return "User cancelled";
      case SimpleHoldError.invalidResponse:
        return "SimpleHold SDK response invalid";
      case SimpleHoldError.notInstalled:
        return "SimpleHold Wallet is not installed";
      default:
        return "";
    }
  }
}
