import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'submit-button',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button matButton="filled" type="submit">Add recipe</button>
  `
})
export class SubmitButton {}