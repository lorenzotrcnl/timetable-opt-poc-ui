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
  valueSlot: string = 'Low';

  @Output() valueSlotChange = new EventEmitter<string>();

  selectSlotPreferences(value: string) {
    this.valueSlot = value;
    this.valueSlotChange.emit(this.valueSlot);
  }
}
