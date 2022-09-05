import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { FaceSnap } from '../models/face-snap.model';

@Injectable({
  providedIn: 'root',
})
export class FaceSnapsService {
  constructor(private http: HttpClient) {}

  faceSnaps!: FaceSnap[];

  getAllFaceSnaps(): Observable<FaceSnap[]> {
    return this.http.get<FaceSnap[]>('http://localhost:3000/facesnaps');
  }

  getFaceSnapById(faceSnapId: number): Observable<FaceSnap> {
    return this.http.get<FaceSnap>(
      `http://localhost:3000/facesnaps/${faceSnapId}`
    );
  }

  snapFaceSnapById(
    faceSnapId: number,
    snapType: 'snap' | 'unsnap'
  ): Observable<FaceSnap> {
    return this.getFaceSnapById(faceSnapId).pipe(
      map((faceSnap: any) => ({
        ...faceSnap,
        snaps: faceSnap.snaps + (snapType === 'snap' ? 1 : -1),
      })),
      switchMap((updatedFaceSnap: any) =>
        this.http.put<FaceSnap>(
          `http://localhost:3000/facesnaps/${faceSnapId}`,
          updatedFaceSnap
        )
      )
    );
  }

  addFaceSnap(formValue: {
    title: string;
    description: string;
    imageUrl: string;
    location?: string;
  }): Observable<FaceSnap> {
    return this.getAllFaceSnaps().pipe(
      map((faceSnap: any) => [...faceSnap].sort((a, b) => a.id - b.id)),
      map(
        (sortedFacesnaps: any) => sortedFacesnaps[sortedFacesnaps.length - 1]
      ),
      map((previousFacesnaps: any) => ({
        ...formValue,
        snaps: 0,
        createdDate: new Date(),
        id: previousFacesnaps.id + 1,
      })),
      switchMap((newFaceSnap: any) =>
        this.http.post<FaceSnap>('http://localhost:3000/facesnaps', newFaceSnap)
      )
    );
    // const faceSnap: FaceSnap = {
    //   ...formValue,
    //   createdDate: new Date(),
    //   snaps: 0,
    //   id: this.faceSnaps[this.faceSnaps.length - 1].id + 1,
    // };
    // this.faceSnaps.push(faceSnap);
  }
}
