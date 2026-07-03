import { Component, model } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  readonly value = model('');
}
