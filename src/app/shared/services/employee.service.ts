/**
 * Employee Service - Handles all CRUD operations for employees
 * Uses localStorage for data persistence
 */

import { Injectable } from '@angular/core';
import { Employee } from '../interface/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
    /**
   * Adds a new employee to the system
   * @param employeeData - Employee data without ID
   * @returns Created employee with generated ID
   */
  private employees: Employee[] = [];
  private lastId = 0;

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      this.employees = JSON.parse(savedEmployees);
      this.lastId = Math.max(...this.employees.map(e => e.id), 0);
    } else {
      this.employees = [
        { id: 1, name: 'John Doe', email: 'john@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg', salary: 50000 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/31.jpg', salary: 60000 },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/20.jpg', salary: 55000 }
      ];
      this.lastId = 3;
      this.saveEmployees();
    }
  }

  private saveEmployees(): void {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  getAllEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee = { ...employee, id: ++this.lastId };
    this.employees.push(newEmployee);
    this.saveEmployees();
    return newEmployee;
  }

  updateEmployee(id: number, employeeData: Omit<Employee, 'id'>): Employee | undefined {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees[index] = { ...employeeData, id };
      this.saveEmployees();
      return this.employees[index];
    }
    return undefined;
  }

  deleteEmployee(id: number): boolean {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      this.saveEmployees();
      return true;
    }
    return false;
  }

  searchEmployees(term: string): Employee[] {
    if (!term.trim()) {
      return this.getAllEmployees();
    }
    term = term.toLowerCase();
    return this.employees.filter(e => 
      e.name.toLowerCase().includes(term) || 
      e.email.toLowerCase().includes(term)
    );
  }
}
