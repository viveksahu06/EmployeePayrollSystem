import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employee: any = {
    name: '',
    profilePic: '',
    gender: '',
    department: [],
    salary: '',
    startDate: { day: '', month: '', year: '' },
    note: ''
  };

  formTitle: string = 'Add New Employee'; 

  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years = Array.from({ length: 50 }, (_, i) => 2025 - i);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  employeeId!: number | null;

  ngOnInit(): void {
    // Get Employee ID from URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.employeeId = +id;
        this.formTitle = 'Update Employee'; 
        this.loadEmployee(this.employeeId);
      }
    });
  }

  loadEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe(employee => {
      if (employee) {
        this.employee = {
          ...employee,
          startDate: this.parseDate(employee.startDate),
        };
      }
    });
  }


  
  // Convert "YYYY-MM-DD" to {day, month, year}
  parseDate(dateString: string) {
    const [day, month, year] = dateString.split('-');
    return { day, month, year };
  }

  // Toggle Department Selection
  toggleDepartment(dept: string) {
    const index = this.employee.department.indexOf(dept);
    if (index > -1) {
      this.employee.department.splice(index, 1);
    } else {
      this.employee.department.push(dept); 
    }
  }

  // Save Employee (Create or Update)
  saveEmployee() {
    const formattedEmployee = {
      ...this.employee,
      startDate: `${this.employee.startDate.day}-${this.employee.startDate.month}-${this.employee.startDate.year}`, 
    };
  
    if (this.employeeId) {
      // Update Employee
      this.employeeService.updateEmployee(this.employeeId, formattedEmployee).subscribe({
        next: () => {
          console.log('Employee updated successfully');
          this.router.navigate(['/']); 
        },
        error: (err) => console.error('Error updating employee:', err) 
      });
    } else {
      // Add New Employee
      this.employeeService.addEmployee(formattedEmployee).subscribe({
        next: () => {
          console.log('Employee added successfully');
          this.router.navigate(['/']); 
        },
        error: (err) => console.error('Error adding employee:', err) 
      });
    }
  }
  
  
}
