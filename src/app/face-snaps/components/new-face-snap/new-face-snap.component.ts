import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { FaceSnap } from '../../../core/models/face-snap.model';
import { FaceSnapsService } from '../../../core/services/face-snaps.service';

@Component({
  selector: 'app-new-face-snap',
  templateUrl: './new-face-snap.component.html',
  styleUrls: ['./new-face-snap.component.scss'],
})
export class NewFaceSnapComponent implements OnInit {
  snapForm!: UntypedFormGroup;
  faceSnapPreview$!: Observable<FaceSnap>;
  urlRegex!: RegExp;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private faceSnapService: FaceSnapsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.urlRegex =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
    this.snapForm = this.formBuilder.group(
      {
        title: [null, Validators.required],
        description: [null, Validators.required],
        imageUrl: [
          null,
          [Validators.required, Validators.pattern(this.urlRegex)],
        ],
        location: [null],
      },
      {
        updateOn: 'blur',
      }
    );

    this.faceSnapPreview$ = this.snapForm.valueChanges.pipe(
      map((formValue) => ({
        ...formValue,
        createdDate: new Date(),
        id: '',
        snaps: 0,
      }))
    );
  }

  onSubmitForm(): void {
    //console.log(this.snapForm.value);
    this.faceSnapService
      .addFaceSnap(this.snapForm.value)
      .pipe(tap(() => this.router.navigateByUrl('facesnaps')))
      .subscribe();
  }
}
