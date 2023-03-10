import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Apollo } from 'apollo-angular';
import { forgotPassword } from '@api/user';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;

  constructor(private apollo: Apollo, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {}

  async sendEmail() {
    try {
      this.isLoading = true;
      const { username } = this.passwordForm.value;
      const { data }: any = await this.apollo
        .mutate({
          mutation: forgotPassword,
          variables: {
            username,
          },
        })
        .toPromise();

      this.passwordForm.markAsPristine();
      this.openSnackBar('Te hemos enviado un correo electrónico para recuperar tu contraseña', 'Aceptar');
    } catch (error) {
      this.openSnackBar('Ocurrió un error al enviar el correo', 'Aceptar');
    } finally {
      this.isLoading = false;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private createForm() {
    this.passwordForm = this.formBuilder.group({
      username: [
        '', 
        [
          Validators.required,
          Validators.pattern(
            /^(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@fiscalia.puebla.gob.mx$/
          ),
          Validators.email,
        ]
      ],
    });
  }
}
