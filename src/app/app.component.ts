import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { SlotComponent } from './slot/slot.component';
import { DataJsonService } from './services/data-json.service';
import { FilterComponent } from './filter/filter.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule, FilterComponent],
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

  allFilters: any[] = [];

  isScenarioPresent: boolean;
  zipPresent: boolean;

  // Constructor
  constructor(private dataService: DataJsonService) {}

  // ngOnInit
  ngOnInit() {
    // Carica info.json e scenario_filters.json in parallelo
    forkJoin([
      this.dataService.getDataFromJSON('assets/info.json'),
      this.dataService.getDataFromJSON('assets/scenario_filters.json')
    ]).subscribe(([infoData, filterData]) => {
      // Valorizza le variabili
      this.teachers = infoData.teachers;
      this.selectedTeacher = this.teachers[0];
      this.classes = infoData.classes;
      this.selectedClass = this.classes[0];
      this.allFilters = filterData;
  
      // Esegui il resto delle operazioni solo dopo aver valorizzato i dati
      this.changeToggle();
    });
  }
  
  // Methods
  handleFilterChange(event: any) {
    // Aggiorna il filtro e chiama loadTimetableData
    this.updateFilterValue(event.abbreviation, event.value);
    this.loadTimetableData();
  }
  
  updateFilterValue(abbreviation: string, value: any) {
    this.allFilters.forEach(accordion => {
      if (accordion.accordion) {
        accordion.accordion.filters.forEach(filter => {
          if (filter.abbreviation === abbreviation) {
            filter.value = value;
          }
        });
      }
    });
  }  

  loadTimetableData() {

    let realFilters = this.allFilters
      .flatMap(filterGroup => filterGroup.accordion?.filters || []);

    let filterWithValue = this.allFilters
      .flatMap(filterGroup => filterGroup.accordion?.filters || [])
      .filter(filter => filter.value!=null || filter.value!=undefined);

    if(filterWithValue.length!==realFilters.length){
      console.error("Non sono valorizzati tutti i filtri");
      return;
    }

    let filteredFilters = this.allFilters
      .flatMap(filterGroup => filterGroup.accordion?.filters || [])
      .filter(filter => filter.index);

    let fileName = filteredFilters
      .map(filter => `${filter.abbreviation}_${filter.value}`)
      .join('_');

    let folderName = this.allFilters
      .flatMap(filterGroup => filterGroup.accordion?.filters || [])
      .map(filter => `${filter.abbreviation}_${filter.value}`)
      .join('_');

    // Aggiungi l'estensione del file zip
    fileName += '.zip';

    // Costruisci il percorso completo del file zip
    const filePath = `assets/${fileName}`;

    console.log(filePath);

    // Carica il file zip e leggi il file result.json
    this.dataService.getDataFromZip(filePath).subscribe(zip => {
      
      let fileFound = false;
      Object.keys(zip.files).forEach(relativePath => {
        const file = zip.files[relativePath];
        if (relativePath === `${folderName}/result.json`) {
          fileFound = true;
          file.async("string").then(content => {
            this.zipPresent = true;
            if(content.trim()=='{}'){
              //Scenario non possibile
              console.error("File result.json vuoto");
              this.isScenarioPresent = false;
              return;
            }
            this.timetableData = JSON.parse(content);
            this.isScenarioPresent = true;
          }).catch(error => {
            console.error("Errore durante la lettura del file result.json", error);
          });
        }
      });
  
      if (!fileFound) {
        //Non esiste il file result.json all'interno della cartella oppure non esiste la cartella
        console.error(`Cartella ${folderName} o file result.json non trovati nel file zip`);
        this.zipPresent = false;
      }

    }, error => {
      //Non esiste il file zip
      console.error("Errore durante il caricamento del file zip", error);
      this.zipPresent = false;
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
    this.searchText = teacher;
    this.filteredTeachers = [];
  }

  filterClasses() {
    this.filteredClasses = this.classes.filter(c =>
      c.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectClass(c: string) {
    this.selectedClass = c;
    this.searchText = c;
    this.filteredClasses = [];
  }

  changeToggle(){
    if(this.showClassesDropdown){
      this.searchText=this.classes[0]
    }
    else{
      this.searchText=this.teachers[0]
    }
  }

}
