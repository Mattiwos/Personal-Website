
export module App {
    export class Secret {
      getLocalhost(): string {
        return "http://localhost:8080";
      }
      getIP(): string {
        return `http://192.168.1.6:8080`;
      }
    }
  }
  