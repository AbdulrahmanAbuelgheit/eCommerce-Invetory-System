// core/services/staff.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@app/environments/environment';
import { StaffAuthService } from './staff-auth.service';

export interface Staff {
  id: number;
  name: string;
  email: string;
  role: 'cashier' | 'manager' | 'super_admin';
  branchId: string;
  lastLogin: Date;
  status: 'active' | 'suspended';
}


@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private auth: StaffAuthService) { }

  getAllStaff(branchId?: string): Observable<Staff[]> {
    let params = new HttpParams();
    if (branchId && branchId !== 'all') {
      params = params.set('branchId', branchId);
    }
    return this.http.get<Staff[]>(this.apiUrl, { params });
  }


  createStaff(staffData: Omit<Staff, 'id'>): Observable<Staff> {
    if (staffData.role === 'super_admin' && !this.auth.isSuperAdmin()) {
      return throwError(() => new Error('Insufficient privileges'));
    }
    return this.http.post<Staff>(this.apiUrl, staffData);
  }

  deleteStaff(staffId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${staffId}`);
  }

  suspendStaff(staffId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${staffId}/suspend`, {});
  }

  transferStaff(staffId: number, newBranchId: string): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${staffId}/transfer`,
      { newBranchId }
    );
  }
}
