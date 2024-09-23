import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.scss'
})


export class CrudFormComponent {
  private apiUrl = 'http://localhost/api-profissionais/profissionais.php';

  cadastroForm: FormGroup;
  isEditMode = false; // Indica se é edição
  isViewMode = false; // Indica se é visualização

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      especialidade: ['', Validators.required],
      crm: ['', Validators.required],
      contato: [''],
      email: ['', [Validators.required, Validators.email]],
      dataContratacao: [''],
      inicioAtendimento: [''],
      fimAtendimento: [''],
      status: ['', Validators.required],
      daysOfWeek: this.fb.array([])  // Inicializa como um array vazio
    });
  }

  ngOnInit(): void {
    const profissionalId = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.paramMap.get('mode');

    if (profissionalId) {
      this.loadProfissional(profissionalId);
      this.isViewMode = mode === 'view';
      this.isEditMode = !this.isViewMode; // Edit mode só se não for 'view'
    }
    this.setFieldsDisabled(this.isViewMode);
  }

  onCheckboxChange(e: any, dayName: string) {
    const daysArray = this.cadastroForm.get('daysOfWeek') as FormArray;

    if (e.checked) {
      // Adiciona o dia ao array quando selecionado
      daysArray.push(new FormControl(dayName));
    } else {
      // Remove o dia do array quando desmarcado
      const index = daysArray.controls.findIndex((item: AbstractControl) => item.value === dayName);
      if (index !== -1) {
        daysArray.removeAt(index);
      }
    }
  }

  loadProfissional(id: string): void {
    this.http.get(`${this.apiUrl}?id=${id}`).subscribe((data: any) => {

      console.log('Dados recebidos:', data); // Log para verificar os valores recebidos

      this.cadastroForm.patchValue({
        nome: data.nome,
        especialidade: data.especialidade,
        crm: data.crm,
        contato: data.contato,
        email: data.email,
        dataContratacao: data.data_contratacao,
        inicioAtendimento: data.inicio_atendimento,
        fimAtendimento: data.fim_atendimento,
      });

      this.setStatusValue(data.status);
      this.setDaysOfWeek(data.dias_da_semana);

      // Desabilita os campos se estiver no modo de visualização
      this.setFieldsDisabled(this.isViewMode);
    });
  }

  setDaysOfWeek(selectedDays: string): void {
    const daysArray = this.cadastroForm.get('daysOfWeek') as FormArray;
    daysArray.clear();
    const days = selectedDays.split(',').map(day => day.trim());

    this.daysOfWeek.forEach(day => {
      day.selected = days.includes(day.name);
      if (day.selected) {
        daysArray.push(new FormControl(day.name));
      }
    });
  }

  setStatusValue(status: string) {
    this.cadastroForm.get('status')?.setValue(status === "ativo");
  }

  setFieldsDisabled(disabled: boolean) {
    Object.keys(this.cadastroForm.controls).forEach(control => {
      this.cadastroForm.get(control)?.[disabled ? 'disable' : 'enable']();
    });

    this.daysOfWeek.forEach(day => {
      day.disabled = disabled;
    });
  }

  get daysOfWeekValid(): boolean {
    const daysArray = this.cadastroForm.get('daysOfWeek') as FormArray;
    return daysArray.controls.length > 0;
  }

  onSubmit() {
    if (this.cadastroForm.valid && this.daysOfWeekValid) {
      const formValue = { ...this.cadastroForm.value };

      if (formValue.dataContratacao instanceof Date) {
        formValue.dataContratacao = formValue.dataContratacao.toISOString().split('T')[0];
      }

      formValue.inicioAtendimento = this.formatTime(formValue.inicioAtendimento);
      formValue.fimAtendimento = this.formatTime(formValue.fimAtendimento);
      const selectedDays = (this.cadastroForm.get('daysOfWeek') as FormArray).controls
        .map(control => control.value)
        .join(',');

      formValue.dias_da_semana = selectedDays;

      if (this.isEditMode) {
        console.log(formValue);
        this.updateProfissional(formValue).subscribe({
          next: (response) => {
            this.openSnackBar('Profissional atualizado com sucesso', 'Fechar');
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar('Erro ao atualizar profissional', 'Fechar');
          },
        });
      } else {
        this.addProfissional(formValue).subscribe({
          next: (response) => {
            this.openSnackBar('Profissional cadastrado com sucesso', 'Fechar');
            this.cadastroForm.reset();
            this.resetDaysOfWeek();
          },
          error: (error) => {
            this.openSnackBar('Erro ao cadastrar profissional', 'Fechar');
          },
        });
      }
    } else {
      this.openSnackBar('Formulário inválido', 'Fechar');
    }
  }

  formatTime(time: string | null): string {
    if (!time) return ''; // Retorna uma string vazia se o valor for nulo ou indefinido

    const timeParts = time.split(':');

    // Se o formato tiver duas partes (HH:mm)
    if (timeParts.length === 2) {
      return timeParts.join(':'); // Retorna como HH:mm
    }
    // Se o formato tiver três partes (HH:mm:ss)
    else if (timeParts.length === 3) {
      return `${timeParts[0]}:${timeParts[1]}`; // Retorna apenas HH:mm
    }

    return ''; // Retorna vazio se não estiver no formato esperado
  }

  resetDaysOfWeek() {
    const daysOfWeekControl = this.cadastroForm.get('daysOfWeek') as FormArray;
    daysOfWeekControl.clear();

    this.daysOfWeek.forEach(day => {
      day.selected = false;
    });
  }

  updateProfissional(profissional: any): Observable<any> {
    const profissionalId = this.route.snapshot.paramMap.get('id');
    return this.http.put(`${this.apiUrl}?id=${profissionalId}`, profissional);
  }

  addProfissional(profissional: any): Observable<any> {
    return this.http.post(this.apiUrl, profissional);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  daysOfWeek = [
    { name: 'Segunda-feira', selected: false, disabled: false },
    { name: 'Terça-feira', selected: false, disabled: false },
    { name: 'Quarta-feira', selected: false, disabled: false },
    { name: 'Quinta-feira', selected: false, disabled: false },
    { name: 'Sexta-feira', selected: false, disabled: false },
    { name: 'Sábado', selected: false, disabled: false },
    { name: 'Domingo', selected: false, disabled: false },
  ];

  specialties = [
    { especialidade: 'Pediatria' },
    { especialidade: 'Ginecologia' },
    { especialidade: 'Obstetrícia' },
    { especialidade: 'Neonatologia' },
    { especialidade: 'Endocrinologia Pediátrica' },
    { especialidade: 'Nutrição Infantil' },
    { especialidade: 'Genética Pediátrica' },
    { especialidade: 'Alergologia Pediátrica' },
  ];
}
