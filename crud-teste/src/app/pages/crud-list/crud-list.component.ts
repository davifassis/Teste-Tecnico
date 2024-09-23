import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatTooltipModule,
    HttpClientModule
  ],
  templateUrl: './crud-list.component.html',
  styleUrl: './crud-list.component.scss'
})
export class CrudListComponent implements AfterViewInit, OnInit
{
  private apiUrl = 'http://localhost/api-profissionais/profissionais.php';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] =
  [
    'nome',
    'especialidade',
    'crm',
    'contato',
    'status',
    'actions'
  ];

  profissionais: any[] = [];
  dataSource:any;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  constructor
  (
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarProfissionais();
  }

  // Método para listar todos os profissionais
  getProfissionais(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  carregarProfissionais() {
    this.getProfissionais().subscribe(data => {
      this.profissionais = data;
      this.dataSource = new MatTableDataSource(this.profissionais);

      console.log(this.profissionais);
    });
  }


  viewProfissional(profissionalId: number): void {
    this.router.navigate(['/crud-form', profissionalId, { mode: 'view' }]);
  }

  editProfissional(profissionalId: number): void {
    this.router.navigate(['/crud-form', profissionalId, { mode: 'edit' }]);
  }


  deleteProfissional(profissionalId: number): void {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      this.http.delete(`${this.apiUrl}?id=${profissionalId}`).subscribe({
        next: () => {
          this.carregarProfissionais(); // Atualiza a lista após a exclusão
        },
        error: (error) => {
          console.error('Erro ao excluir profissional:', error);
        }
      });
    }
  }
}
