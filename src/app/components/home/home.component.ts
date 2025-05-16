import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee.service';
import { Router } from '@angular/router';
import { Employee } from '../../shared/interface/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  searchTerm: string = '';
  employeeForm: FormGroup;
  addModal: any;
  editModal: any;
  currentEmployeeId: number | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  @ViewChild('addEmployeeModal') addEmployeeModal!: ElementRef;
  @ViewChild('editEmployeeModal') editEmployeeModal!: ElementRef;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: ['', Validators.required],
      salary: ['', [Validators.min(100), Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.addModal = new bootstrap.Modal(this.addEmployeeModal.nativeElement);
    this.editModal = new bootstrap.Modal(this.editEmployeeModal.nativeElement);
  }

  loadEmployees(): void {
    this.employees = this.employeeService.getAllEmployees();
    this.filteredEmployees = [...this.employees];
    this.updateDisplayedEmployees();
  }

  onSearch(): void {
    this.filteredEmployees = this.employeeService.searchEmployees(this.searchTerm);
    this.currentPage = 1;
    this.updateDisplayedEmployees();
  }

  updateDisplayedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    let pages: number[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages = [1, 2, 3, 4, 5];
      } else if (this.currentPage >= totalPages - 2) {
        pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2];
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updateDisplayedEmployees();
    }
  }

  openAddModal(): void {
    this.employeeForm.reset({
      role: 'Employee',
      salary: ''
    });
    this.currentEmployeeId = null;
    this.addModal.show();
  }

  openEditModal(id: number): void {
    this.currentEmployeeId = id;
    const employee = this.employeeService.getEmployeeById(id);
    if (employee) {
      this.employeeForm.patchValue({
        name: employee.name,
        email: employee.email,
        imageUrl: employee.imageUrl,
        salary: employee.salary 
      });
      this.editModal.show();
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = {
        id: 0, // This will be set by the service
        name: this.employeeForm.value.name,
        email: this.employeeForm.value.email,
        imageUrl: this.employeeForm.value.imageUrl,
        salary: this.employeeForm.value.salary
      };
      
      if (this.currentEmployeeId) {
        // Update existing employee
        employeeData.id = this.currentEmployeeId;
        this.employeeService.updateEmployee(this.currentEmployeeId, employeeData);
        this.editModal.hide();
      } else {
        // Add new employee
        this.employeeService.addEmployee(employeeData);
        this.addModal.hide();
      }
      
      this.loadEmployees();
      this.employeeForm.reset({
        role: 'Employee',
        salary: ''
      });
      this.currentEmployeeId = null;
    }
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(id);
        this.loadEmployees();
        Swal.fire(
          'Deleted!',
          'Contact has been deleted.',
          'success'
        );
      }
    });
  }
}
