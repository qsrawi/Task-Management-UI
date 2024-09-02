// import { Directive, HostListener, ElementRef, Input, OnInit } from '@angular/core';
// import { NgModel } from '@angular/forms';

// @Directive({
//   selector: '[appDateFormat]'
// })
// export class DateFormatDirective implements OnInit {
//   @Input() appDateFormat: string = 'yyyy-MM-dd'; // Default format

//   constructor(private el: ElementRef, private ngModel: NgModel) {}

//   ngOnInit() {
//     if (this.ngModel) {
//       this.ngModel.valueChanges!.subscribe(value => {
//         if (value !== undefined && value !== null) {
//           this.el.nativeElement.value = this.formatDate(value);
//         } else {
//           this.el.nativeElement.value = ''; // Clear the input if value is undefined or null
//         }
//       });
//     }
//   }

//   @HostListener('blur', ['$event.target.value'])
//   onBlur(value: string) {
//     if (value) {
//       const parsedDate = this.parseDate(value);
//       if (this.ngModel) {
//         this.ngModel.control.setValue(parsedDate, { emitEvent: false });
//       }
//     } else {
//       // Handle case where value is empty (e.g., clear the ngModel value)
//       if (this.ngModel) {
//         this.ngModel.control.setValue(null, { emitEvent: false });
//       }
//     }
//   }

//   formatDate(date: Date | string | undefined): string {
//     if (!date) return ''; // Handle undefined or null
//     const d = new Date(date);
//     const month = `0${d.getMonth() + 1}`.slice(-2);
//     const day = `0${d.getDate()}`.slice(-2);
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   }

//   parseDate(dateString: string): Date | null {
//     if (!dateString) return null; // Handle empty string
//     const [year, month, day] = dateString.split('-').map(Number);
//     return new Date(year, month - 1, day);
//   }
// }
