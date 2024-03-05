import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FormsModule,
    HttpClientModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'anmiliotest';
  isLoggedIn = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const localData = localStorage.getItem('app_token');
    if (localData != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialo = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '300px',
      panelClass: 'my-dialog-confirm',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialo.beforeClosed().subscribe((result: any) => {
      if (result) {
        this.handleFooterButtonClick();
        this.reloadPage();
      }
    });
  }
  handleFooterButtonClick() {
    localStorage.removeItem('app_token');
    // this.router.navigateByUrl('/login');
  }

  reloadPage(): void {
    window.location.reload();
  }
}
@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<h2 mat-dialog-title>Alerta</h2>
    <mat-dialog-content> ¿ Deseas salir del sistema ? </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close [mat-dialog-close]="false">No</button>
      <button
        mat-button
        mat-dialog-close
        cdkFocusInitial
        [mat-dialog-close]="true"
      >
        Ok
      </button>
    </mat-dialog-actions>`,
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
  handleFooterButtonClick2() {
    this.dialogRef.close('false');
  }
}
