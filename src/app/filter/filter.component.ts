import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SlotComponent } from '../slot/slot.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, SlotComponent],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges{

  @Input() allFilters: any;
  @Output() filterChange = new EventEmitter<any>();

  ngOnInit() {
    console.log("onInit");
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allFilters']) {
      console.log("allFilters changed", this.allFilters);
      this.initializeDefaultSettings();
    }
  }

  initializeDefaultSettings() {
    const defaultSettings = this.allFilters.find(f => f.defaultSettings);
    console.log("DefaultSettings");
    if (defaultSettings) {
      Object.keys(defaultSettings.defaultSettings).forEach(key => {
        const value = defaultSettings.defaultSettings[key];
        this.updateFilterValue(key, value);
      });
    }
  }

  updateFilterValue(abbreviation: string, value: any) {
    this.filterChange.emit({ abbreviation, value });
  }

  increaseValue(filter: any) {
    if (filter.value < filter.max) {
      filter.value++;
      this.updateFilterValue(filter.abbreviation, filter.value);
    }
  }

  decreaseValue(filter: any) {
    if (filter.value > filter.min) {
      filter.value--;
      this.updateFilterValue(filter.abbreviation, filter.value);
    }
  }

}
