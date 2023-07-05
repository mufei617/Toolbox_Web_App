import { Injectable } from '@angular/core';
import { IPasswordStrengthMeterService } from 'angular-password-strength-meter';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService extends IPasswordStrengthMeterService {
  score(password: string): number {
    // TODO - return score 0 - 4 based on password
    return 0;
  }

  scoreWithFeedback(password: string): {
    score: number;
    feedback: { warning: string; suggestions: string[] };
  } {
    const pattern1 = /^(?=.*?[#?!@$%^&*-])/;
    const pattern2 = /^(?=.*?[0-9])/;
    const pattern3 = /^(?=.*?[a-z])/;
    const pattern4 = /^(?=.*?[A-Z])/;
    // TODO - return score with feedback
    if(password.length<8){
      return { score: 0, feedback: { warning: 'too short', suggestions: ['password should more than 8 digates.'] } };

    }
    else if (password.match(pattern1) && password.match(pattern2) && password.match(pattern3) && password.match(pattern4)) {
      return { score: 4, feedback: { warning: 'strong', suggestions: ['password perfect'] } };
    } else if (
      (password.match(pattern1) && password.match(pattern2) && password.match(pattern3)) ||
      (password.match(pattern1) && password.match(pattern3) && password.match(pattern4)) ||
      (password.match(pattern2) && password.match(pattern3) && password.match(pattern4)) ||
      (password.match(pattern1) && password.match(pattern2) && password.match(pattern4))
    ) {
      return { score: 3, feedback: { warning: 'not enough', suggestions: ['still not enough'] } };
    } else if (
      password.match(pattern1) && password.match(pattern2) ||
      password.match(pattern1) && password.match(pattern3) ||
      password.match(pattern1) && password.match(pattern4) ||
      password.match(pattern2) && password.match(pattern3) ||
      password.match(pattern4) && password.match(pattern2) ||
      password.match(pattern3) && password.match(pattern4)
    ) {
      return { score: 2, feedback: { warning: 'weak', suggestions: ['not enough'] } };
    } else if (password.match(pattern1) || password.match(pattern2) || password.match(pattern3) || password.match(pattern4)) {
      return { score: 1, feedback: { warning: 'too weak', suggestions: ['not enough'] } };
    }

    return { score: 0, feedback: { warning: 'not a password', suggestions: ['enter your password, please'] } };
  }
}
