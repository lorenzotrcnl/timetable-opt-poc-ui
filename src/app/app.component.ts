import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { SlotComponent } from './slot/slot.component';
import { DataJsonService } from './services/data-json.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule, SlotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Variables
  title = 'TimeTable - Optimization';
  slots: Map<number, string> = new Map<number, string>(Array.from({ length: 6 }, (_, i) => [i, 'Low']));
  teachers: any[] = [];
  filteredTeachers: any[] = [];
  selectedTeacher: any;
  classes: any[] = [];
  filteredClasses: any[] = [];
  selectedClass: any;
  showClassesDropdown: boolean = true
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  slotsArray = [0, 1, 2, 3, 4, 5];
  timetableData: any;
  searchText: string = ''

  isMenuClosed: boolean = false;

  // Constructor
  constructor(private dataService: DataJsonService) {}

  // ngOnInit
  ngOnInit() {

    this.dataService.getDataFromJSON('assets/info.json').subscribe(data => {
      this.teachers = data.teachers;
      this.selectedTeacher = this.teachers[0]
      this.classes = data.classes;
      this.selectedClass = this.classes[0]
    });

    this.loadTimetableData();
  }

  // Methods
  loadTimetableData() {
    const folderName = Array.from(this.slots).map(([key, value]) => `${key}_${value}`).join('_');
    const url = `assets/${folderName}/result.json`;

    this.dataService.getDataFromJSON(url).subscribe(data => {
      this.timetableData = data;
    });
  }

  toggleMenu() {
    this.isMenuClosed = !this.isMenuClosed;
  }

  getTeachersView(day: string, slot: number) {
    if (this.selectedTeacher && this.timetableData && this.timetableData.teacher_view && this.timetableData.teacher_view[this.selectedTeacher]) {
      return [this.timetableData.teacher_view[this.selectedTeacher][day][slot]];
    }
    return [];
  }

  getClassView(day: string, slot: number) {
    if (this.selectedClass && this.timetableData && this.timetableData.class_view && this.timetableData.class_view[this.selectedClass]) {
      return [this.timetableData.class_view[this.selectedClass][day][slot]];
    }
    return [];
  }

  recoverScenario(valueSlot: any, index: number) {
    this.slots.set(index, valueSlot);
    this.loadTimetableData();
  }

  filterTeachers() {
    this.filteredTeachers = this.teachers.filter(teacher =>
      teacher.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectTeacher(teacher: string) {
    this.selectedTeacher = teacher;
    this.searchText = '';
    this.filteredTeachers = [];
  }

  filterClasses() {
    this.filteredClasses = this.classes.filter(c =>
      c.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectClass(c: string) {
    this.selectedClass = c;
    this.searchText = '';
    this.filteredClasses = [];
  }

}
