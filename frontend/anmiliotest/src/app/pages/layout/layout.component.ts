import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
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
  selector: 'app-layout',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}
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
      }
    });
  }
  handleFooterButtonClick() {
    localStorage.removeItem('app_token');
    this.router.navigateByUrl('/login');
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
