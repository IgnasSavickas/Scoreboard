import {Component, Inject, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Team} from '../../../models/team';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FileUploadService} from '../../../services/file-upload.service';
import {HttpResponse} from '@angular/common/http';
import {FileUploadResult} from '../../../models/file-upload-result';

@Component({
  selector: 'app-teams-input',
  templateUrl: './teams-input.component.html',
  styleUrls: ['./teams-input.component.css']
})
export class TeamsInputComponent implements OnInit {
  team: Team;
  title: string;
  buttonText: string;
  selectedFile: File = null;

  constructor(private fileUploadService: FileUploadService, public dialogRef: MatDialogRef<TeamsInputComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data !== null) {
      this.team = data.team;
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  onButtonClick() {
    if (this.selectedFile !== null) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.ok) {
            const uploadResult = event.body as FileUploadResult;
            this.team.logoPath = uploadResult.fileName;
            this.addTeam();
          } else {
            console.log('Failed to upload!');
          }
        }
      });
    } else {
      this.addTeam();
    }
  }

  addTeam() {
    const teamResult = new Team();
    teamResult.id = this.team.id;
    teamResult.name = this.team.name;
    teamResult.logoPath = this.team.logoPath;
    this.dialogRef.close(teamResult);
  }

}
