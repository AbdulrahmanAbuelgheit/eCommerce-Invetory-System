import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@app/environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

export interface BranchStock {
  product: {
    _id: string;
    name: string;
    costPrice: number;
    soldPrice: number;
    description: string;
    mainStock: number;
    categoryId: string;
    categoryName: string;
    sellerId?: string;
    createdAt?: string;
    updatedAt?: string;
    images: { fileId: string; filePath: string; _id?: string }[];
    __v?: number;
  };
  quantity: number;
}

export interface Branch {
  _id?: string;
  name: string;
  location: string;
  phone: string;
  stock: BranchStock[];
}

export interface ProductOperation {
  productId: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class BranchService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Create new branch
  createBranch(branchData: Omit<Branch, '_id'>): Observable<Branch> {
    return this.http.post<Branch>(`${this.apiUrl}/branches`, branchData);
  }

  // Add product to branch stock
  addProductToBranch(branchId: string, productData: ProductOperation): Observable<Branch> {
    return this.http.post<Branch>(
      `${this.apiUrl}/branches/add-product/${branchId}`,
      productData
    );
  }

  // Search products in branch
  searchBranchProducts(branchId: string, searchTerm: string): Observable<BranchStock[]> {
    const params = new HttpParams().set('term', searchTerm);
    return this.http.get<BranchStock[]>(
      `${this.apiUrl}/branches/searchproducts/${branchId}`,
      { params }
    );
  }

  // Filter products by price range
  filterBranchProductsByPrice(branchId: string, minPrice: number, maxPrice: number): Observable<BranchStock[]> {
    const params = new HttpParams()
      .set('min', minPrice.toString())
      .set('max', maxPrice.toString());

    return this.http.get<BranchStock[]>(
      `${this.apiUrl}/branches/${branchId}`,
      { params }
    );
  }

  // Remove product from branch
  removeProductFromBranch(branchId: string, productData: ProductOperation): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/branches/remove-product/${branchId}`,
      { body: productData }
    );
  }

  // Get branch details with products
  getBranchDetails(branchId: string): Observable<Branch> {
    return this.http.get<any>(`${this.apiUrl}/branches/BranchProducts/${branchId}`).pipe(
      tap(response => console.log('API Response:', response)), // Log the response for debugging
      map(response => {
        // Validate the response structure
        if (!response || !response.data) {
          throw new Error('Invalid API response: Missing data property');
        }

        // Map the response to the Branch interface
        return {
          _id: branchId, // Use the provided branchId since it's not in the response
          name: 'Branch Name', // Default name (you can replace this with actual data if available)
          location: 'Branch Location', // Default location
          phone: 'Branch Phone', // Default phone
          stock: response.data.map((item: any) => ({
            product: item.product,
            quantity: item.quantity
          }))
        };
      }),
      catchError((error) => {
        console.error('Error fetching branch products:', error);
        return throwError(() => new Error('Failed to fetch branch products. Please check the API response.'));
      })
    );
  }

  // Get all branches
  getAllBranches(): Observable<Branch[]> {
    return this.http.get<{ success: boolean, data: Branch[] }>(`${this.apiUrl}/branches`).pipe(
      map(response => response.data), // Extract the `data` array
      tap(branches => console.log('Branches:', branches)), // Debug the extracted data
      catchError(error => {
        console.error('API Error:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  // Get products by branch ID
  getProductsByBranchId(branchId: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branches/${branchId}`);
  }

  // Edit branch by ID
  editBranchById(branchId: string, branchData: Partial<Branch>): Observable<Branch> {
    return this.http.put<Branch>(`${this.apiUrl}/branches/${branchId}`, branchData);
  }

  // Delete branch by ID
  deleteBranchById(branchId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/branches/${branchId}`);
  }

  // Get my branch products
  getMyBranchProducts(): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branches/my/BranchProducts/`);
  }

  // Get branch products (alternative method)
  getBranchProducts(branchId: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branches/BranchProducts/${branchId}`).pipe(
      map((response) => {
        if (!response) {
          // Return a default Branch object if the response is empty
          return {
            _id: branchId,
            name: 'Unknown Branch',
            location: 'Unknown Location',
            phone: 'Unknown Phone',
            stock: [] // Initialize stock as an empty array
          };
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching branch products:', error);
        return throwError(() => new Error('Failed to fetch branch products. Please try again.'));
      })
    );
  }
}