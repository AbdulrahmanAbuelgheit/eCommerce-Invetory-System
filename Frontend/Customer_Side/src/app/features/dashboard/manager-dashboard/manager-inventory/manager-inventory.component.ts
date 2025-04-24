import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManagerService } from '@app/services/manager.service';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manager-inventory',
  imports: [CommonModule,DataTablesModule],
  templateUrl: './manager-inventory.component.html',
  styleUrl: './manager-inventory.component.scss'
})
export class ManagerInventoryComponent {

  branchProducts: any[] = [];
    imageRotationIntervals: { [key: string]: any } = {}; // Stores intervals for each product
  
    //DataTables variable
      dtOptions: Config = {};
      dttrigger: Subject<any> = new Subject<any>();
  
    constructor(private managerService: ManagerService) {}
  
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
            targets: 1,
            searchable: false,
          }
        ]
      };
      this.fetchProductsData();
    }
  
    fetchProductsData(): void {
      this.managerService.getProducts().subscribe({
        next: (response) => {
          this.branchProducts = response.data;
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
      //console.log(product.images[index].filePath);
      return product.images[index].filePath;
    }

  

}
