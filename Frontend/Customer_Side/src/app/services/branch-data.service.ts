import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchDataService {
  private branchNameSource = new BehaviorSubject<string>('');
  private branchIdSource = new BehaviorSubject<string>('');

  currentBranchName = this.branchNameSource.asObservable();
  currentBranchId = this.branchIdSource.asObservable();

  updateBranchData(branchName: string, branchId: string) {
    this.branchNameSource.next(branchName);
    this.branchIdSource.next(branchId);
  }
}