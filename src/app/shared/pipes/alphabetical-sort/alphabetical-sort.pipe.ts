import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'alphabeticalSort'
})
export class AlphabeticalSortPipe implements PipeTransform {
  transform(value: any[], key?: string, direction: string = 'asc'): any[] {
    if (!Array.isArray(value) || value.length === 0) {
      return [];
    }

    if (!key) {
      // Sort array of strings alphabetically
      return value.sort((a, b) => {
        const aValue = a.toLowerCase();
        const bValue = b.toLowerCase();
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
    }

    // Sort array of objects by a specific key alphabetically
    return value.sort((a, b) => {
      const aValue = a[key].toLowerCase();
      const bValue = b[key].toLowerCase();
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }
}
