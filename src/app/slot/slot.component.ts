import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-slot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent {
  valueSlot: number = 0;

  @Output() valueSlotChange = new EventEmitter<number>();

  selectSlotPreferences(value: number) {
    this.valueSlot = value;
    this.valueSlotChange.emit(this.valueSlot);
  }
}
