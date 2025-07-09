import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { PublicidadeTableComponent } from './components/publicidade-table/publicidade-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
   // PublicidadeTableComponent,
    RouterOutlet,
  ]
})
export class AppComponent {
  title = 'frontend';
}
