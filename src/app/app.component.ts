import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { HttpProviderService } from "./service/http-provider.service";
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private httpProviderService: HttpProviderService
  ) {}

  HomeClick() {
    window.location.href = "https://localhost:53275";
    // this.router.navigate(['Home']);
  }

  logOut() {
    // Call the existing logout method to perform any local logout logic
    this.authenticationService.logout();

    // Call the backend logout URL
    this.httpProviderService.logout().subscribe(
      () => {
        // Handle successful logout response
        console.log("Backend logout successful");
        // Redirect to login page or perform other actions
        this.router.navigate(["login"]);
      },
      (error) => {
        // Handle error response
        console.error("Backend logout failed:", error);
        // Perform error handling logic, such as displaying an error message
      }
    );
  }
}
