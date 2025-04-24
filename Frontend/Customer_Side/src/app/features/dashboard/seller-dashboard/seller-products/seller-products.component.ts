import { Component, AfterViewInit, OnInit } from '@angular/core';
import { SellerService } from '../../../../services/seller.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule,DataTablesModule,NgbDropdownModule],
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.scss']
})
export class SellerProductsComponent implements OnInit {
  sellerProducts: any[] = [];
  selectedBranchId: string = 'all';
  imageRotationIntervals: { [key: string]: any } = {}; // Stores intervals for each product

  //DataTables variable
    dtOptions: Config = {};
    dttrigger: Subject<any> = new Subject<any>();

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [
        {
          targets: 0, // First column (index)
          searchable: false,
          orderable: true,
          render: function (data: any, type: any, full: any, meta: any) {
            return meta.row + 1; // Row index + 1 for human-readable numbering
          }
        },
        {
          targets: 5, // First column (index)
          width: '18%',
          
        },
        {
          targets: 1,
          searchable: false,
        }
      ]
    };
    this.fetchProductsData();
  }

  fetchProductsData(): void {
    this.sellerService.getProducts().subscribe({
      next: (response) => {
        this.sellerProducts = response.data;
        this.dttrigger.next(null);
      },
      error: (err) => {
        console.error('Failed to fetch dashboard data:', err);
      }
    });
  }


  // Function to start image rotation on hover
  startImageRotation(product: any) {
    let currentIndex = 0;
    this.imageRotationIntervals[product._id] = setInterval(() => {
      currentIndex = (currentIndex + 1) % product.images.length;
      product.currentImageIndex = currentIndex;
    }, 1000); // Change image every 1 second
  }

  // Function to stop image rotation when hover ends
  stopImageRotation(product: any) {
    clearInterval(this.imageRotationIntervals[product._id]);
    product.currentImageIndex = 0; // Reset to the first image
  }

  // Function to get the current image to display
  getCurrentImage(product: any): string {
    const index = product.currentImageIndex || 0;
    return product.images[index].filePath;
  }


  // Function to handle branch selection
onBranchChange(product: any, branchId: string) {
  product.selectedBranchId = branchId;
}

// Function to get the selected branch name
getSelectedBranchName(product: any): string {
  if (product.selectedBranchId === 'all') {
    return 'Main Stock';
  } else {
    const selectedBranch = product.branches.find(
      (branch: any) => branch.branchId === product.selectedBranchId
    );
    return selectedBranch ? selectedBranch.branchName : 'Main Stock';
  }
}

getQuantity(product: any): number {
  if (product.selectedBranchId === 'all') {
    return product.mainStock;
  } else {
    const selectedBranch = product.branches.find(
      (branch: any) => branch.branchId === product.selectedBranchId
    );
    return selectedBranch ? selectedBranch.quantityAvailable : product.mainStock;
  }
}

 
}