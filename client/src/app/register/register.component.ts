import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PasswordStrengthService } from '../_services/password-strength.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {}
  suggestion: string =''
  passwordSuggestions: string[] = [];

  constructor(private accountService: AccountService,
    private toastrService: ToastrService,private router: Router, private passwordStrengthMeterService: PasswordStrengthService ) { }

  ngOnInit(): void {
  }
  register(){
    if(this.model.username == null){
        this.toastrService.error('enter your username.');
        return
    }
    if( this.model.password != this.model.confirmPassword)
    {
      console.log(this.model.password)
      console.log(this.model.confirmPassword)
      this.toastrService.error('Password not same with confirm password');
      return
    }
    if(this.passwordStrengthMeterService.scoreWithFeedback((this.model.password)).score == (0||1||2||3)){
      this.toastrService.error('Password not safe!');
      return;
    }
    this.accountService.register(this.model).subscribe(
      (response) =>{
        this.toastrService.success('register success');
        this.router.navigateByUrl('/welcome')

      },
      (error) =>{
        this.toastrService.error('register failed');
      }
    )
    
  }
  gotoLogin(){
    this.router.navigateByUrl('/')


  }
}
