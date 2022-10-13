import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authServive:AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode=!this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid)return;

    this.isLoading=true;
    const email=form.value.email;
    const password=form.value.password;

    let authObs:Observable<AuthResponseData>;
    if(this.isLoginMode){
      authObs = this.authServive.login(email,password);
    }
    else{
      authObs = this.authServive.signup(email,password)
    }
    authObs.subscribe(
      res=>{
        this.isLoading=false;
        console.log(res);
        this.router.navigate(['/recipes']);
      },
      error=>{
        this.isLoading=false;
        this.error=error;
        console.log(error);
      }
    );
    form.reset();
  }
}
