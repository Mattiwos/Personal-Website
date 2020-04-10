//http://192.168.42.81:3000
//
export module App {
  export class Secret {
    getLocalhost(): string {
      return "http://localhost:8080";
    }
    getIP(): string {
      return `http://${location.hostname}:8080`;
    }
  }
}
