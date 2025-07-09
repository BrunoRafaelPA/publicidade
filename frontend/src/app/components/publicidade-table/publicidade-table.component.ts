import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { PublicidadeService } from '../../services/publicidade.service';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PopoverModule } from 'primeng/popover';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextarea } from 'primeng/inputtextarea';

@Component({
  selector: 'app-publicidade-table',
  standalone: true,
  templateUrl: './publicidade-table.component.html',
  styleUrls: ['./publicidade-table.component.scss'],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    MultiSelectModule,
    DatePickerModule,
    InputTextModule,
    InputTextarea,
    ReactiveFormsModule,
    SelectModule,
    PopoverModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class PublicidadeTableComponent implements OnInit {
  public publicidades: any[] = [];
  public publicidadesAtivas: any[] = [];
  public publicidadesAgendadas: any[] = [];
  public publicidadesEncerradas: any[] = [];
  
  // Arrays para armazenar dados filtrados
  public publicidadesAtivasFiltradas: any[] = [];
  public publicidadesAgendadasFiltradas: any[] = [];
  public publicidadesEncerradasFiltradas: any[] = [];
  
  public estados: any[] = [];
  public exibirModal: boolean = false;
  public imagemPreview: string | null = null;
  public publicidadeSelecionada: any | null = null;
  public publicidadeForm!: FormGroup;
  public estadoSelecionado: any = null;
  public buscaPorTitulo: string = '';
  public selectedFileName: string = '';

  constructor(
    private publicidadeService: PublicidadeService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarEstados();
    this.carregarPublicidades();
  }

  inicializarFormulario(): void {
    this.publicidadeForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', Validators.required],
      estados: [[], Validators.required],
      dt_inicio: [null, Validators.required],
      dt_fim: [null, Validators.required],
      botao_link: ['', Validators.required],
      titulo_botao_link: ['', Validators.required],
      imagem: [null],
    });
  }

  // Método para aplicar filtros
  aplicarFiltros(): void {
    console.log('Aplicando filtros...');
    console.log('Estado selecionado:', this.estadoSelecionado);
    console.log('Termo de busca:', this.buscaPorTitulo);

    const termoBusca = this.buscaPorTitulo.toLowerCase().trim();
    const estadoFiltro = this.estadoSelecionado;

    // Filtrar publicidades ativas
    this.publicidadesAtivasFiltradas = this.publicidadesAtivas.filter(publicidade => {
      const matchBusca = this.verificarMatchBusca(publicidade, termoBusca);
      const matchEstado = this.verificarMatchEstado(publicidade, estadoFiltro);
      console.log(`Publicidade ${publicidade.titulo}: busca=${matchBusca}, estado=${matchEstado}`);
      return matchBusca && matchEstado;
    });

    // Filtrar publicidades agendadas
    this.publicidadesAgendadasFiltradas = this.publicidadesAgendadas.filter(publicidade => {
      const matchBusca = this.verificarMatchBusca(publicidade, termoBusca);
      const matchEstado = this.verificarMatchEstado(publicidade, estadoFiltro);
      return matchBusca && matchEstado;
    });

    // Filtrar publicidades encerradas
    this.publicidadesEncerradasFiltradas = this.publicidadesEncerradas.filter(publicidade => {
      const matchBusca = this.verificarMatchBusca(publicidade, termoBusca);
      const matchEstado = this.verificarMatchEstado(publicidade, estadoFiltro);
      return matchBusca && matchEstado;
    });

    console.log('Resultados filtrados:');
    console.log('Ativas:', this.publicidadesAtivasFiltradas.length);
    console.log('Agendadas:', this.publicidadesAgendadasFiltradas.length);
    console.log('Encerradas:', this.publicidadesEncerradasFiltradas.length);
  }

  // Verifica se a publicidade corresponde ao termo de busca
  private verificarMatchBusca(publicidade: any, termoBusca: string): boolean {
    if (!termoBusca) return true;

    // Buscar no título
    const tituloMatch = publicidade.titulo?.toLowerCase().includes(termoBusca);
    
    // Buscar na descrição
    const descricaoMatch = publicidade.descricao?.toLowerCase().includes(termoBusca);
    
    // Buscar nos estados
    const estadosMatch = publicidade.estados?.some((estado: any) => 
      estado.descricao?.toLowerCase().includes(termoBusca)
    );

    return tituloMatch || descricaoMatch || estadosMatch;
  }

  // Verifica se a publicidade corresponde ao filtro de estado
  private verificarMatchEstado(publicidade: any, estadoFiltro: any): boolean {
    if (!estadoFiltro || !estadoFiltro.id) {
      console.log('Sem filtro de estado, retornando true');
      return true;
    }

    console.log('Verificando estado para publicidade:', publicidade.titulo);
    console.log('Estados da publicidade:', publicidade.estados);
    console.log('Estado filtro ID:', estadoFiltro.id);

    const match = publicidade.estados?.some((estado: any) => {
      console.log(`Comparando estado ${estado.id} com filtro ${estadoFiltro.id}`);
      return estado.id === estadoFiltro.id;
    });

    console.log('Match resultado:', match);
    return match || false;
  }

  // Método chamado quando o filtro de estado muda
  filtrarPorEstado(): void {
    console.log('Filtro de estado chamado:', this.estadoSelecionado);
    this.aplicarFiltros();
  }

  // Método chamado quando o campo de busca muda
  filtrarPorTitulo(): void {
    console.log('Filtro de busca chamado:', this.buscaPorTitulo);
    this.aplicarFiltros();
  }

  // Método para limpar filtros
  limparFiltros(): void {
    this.estadoSelecionado = null;
    this.buscaPorTitulo = '';
    this.aplicarFiltros();
  }

  abrirModal(publicidade: any = null): void {
    if (publicidade) {
      this.publicidadeSelecionada = { ...publicidade };
      const estadosSelecionados = this.estados.filter(e =>
        publicidade.estados.some((pe: any) => pe.id === e.id)
      );
      this.publicidadeForm.patchValue({
        titulo: publicidade.titulo,
        descricao: publicidade.descricao,
        dt_inicio: new Date(publicidade.dt_inicio),
        dt_fim: new Date(publicidade.dt_fim),
        botao_link: publicidade.botao_link,
        titulo_botao_link: publicidade.titulo_botao_link,
        estados: estadosSelecionados,
        imagem: null
      });
      this.imagemPreview = publicidade.imagem_base64 || null;
      this.selectedFileName = publicidade.imagem_base64 ? 'imagem-publicidade.png' : '';
    } else {
      this.publicidadeSelecionada = null;
      this.publicidadeForm.reset();
      this.imagemPreview = null;
      this.selectedFileName = '';
    }

    this.exibirModal = true;
  }

  onModalHide(): void {
    this.limparDadosModal();
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos de imagem.',
          life: 3000
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'A imagem deve ter no máximo 10MB.',
          life: 3000
        });
        return;
      }

      this.selectedFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imagemPreview = e.target.result as string;
          this.publicidadeForm.get('imagem')?.setValue(file);
        }
      };
      
      reader.onerror = () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao ler o arquivo de imagem.',
          life: 3000
        });
      };
      
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('imageUploadInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  removeImage(): void {
    this.imagemPreview = null;
    this.selectedFileName = '';
    
    const fileInput = document.getElementById('imageUploadInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.publicidadeForm.get('imagem')?.setValue(null);
    
    if (this.publicidadeSelecionada) {
      this.publicidadeSelecionada.imagem_base64 = null;
    }
  }

  onImageError(event: any): void {
    console.error('Erro ao carregar imagem:', event);
    event.target.style.display = 'none';
  }

  onSalvar(): void {
    this.publicidadeForm.markAllAsTouched();
    const erros: string[] = [];

    if (!this.publicidadeForm.get('estados')?.value || this.publicidadeForm.get('estados')?.value.length === 0) {
      erros.push('Selecione pelo menos um estado');
    }

    if (!this.publicidadeForm.get('titulo')?.value || this.publicidadeForm.get('titulo')?.value.trim().length < 3) {
      erros.push('Título é obrigatório e deve ter pelo menos 3 caracteres');
    }

    if (!this.publicidadeForm.get('descricao')?.value || this.publicidadeForm.get('descricao')?.value.trim().length === 0) {
      erros.push('Descrição é obrigatória');
    }

    if (!this.publicidadeForm.get('titulo_botao_link')?.value || this.publicidadeForm.get('titulo_botao_link')?.value.trim().length === 0) {
      erros.push('Título do botão é obrigatório');
    }

    if (!this.publicidadeForm.get('botao_link')?.value || this.publicidadeForm.get('botao_link')?.value.trim().length === 0) {
      erros.push('Link do botão é obrigatório');
    }

    if (!this.publicidadeForm.get('dt_inicio')?.value) {
      erros.push('Data de início é obrigatória');
    }

    if (!this.publicidadeForm.get('dt_fim')?.value) {
      erros.push('Data de fim é obrigatória');
    }

    if (!this.publicidadeSelecionada && (!this.imagemPreview && !this.publicidadeForm.get('imagem')?.value)) {
      erros.push('Imagem da Publicidade é obrigatória');
    } else if (this.publicidadeSelecionada && !this.imagemPreview && !this.publicidadeSelecionada.imagem_base64) {
      erros.push('Imagem da Publicidade é obrigatória');
    }

    const dataInicio = this.publicidadeForm.get('dt_inicio')?.value;
    const dataFim = this.publicidadeForm.get('dt_fim')?.value;
    
    if (dataInicio && dataFim && new Date(dataFim) <= new Date(dataInicio)) {
      erros.push('Data de fim deve ser posterior à data de início');
    }

    if (erros.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campos obrigatórios',
        detail: 'Por favor, corrija os seguintes campos:\n• ' + erros.join('\n• '),
        life: 8000
      });
      return;
    }

    try {
      const formData = new FormData();
      const formValue = this.publicidadeForm.value;

      formData.append('publicidade[titulo]', formValue.titulo.trim());
      formData.append('publicidade[descricao]', formValue.descricao.trim());
      formData.append('publicidade[dt_inicio]', new Date(formValue.dt_inicio).toISOString());
      formData.append('publicidade[dt_fim]', new Date(formValue.dt_fim).toISOString());
      formData.append('publicidade[botao_link]', formValue.botao_link.trim());
      formData.append('publicidade[titulo_botao_link]', formValue.titulo_botao_link.trim());

      if (formValue.estados && Array.isArray(formValue.estados)) {
        formValue.estados.forEach((estado: any) => {
          formData.append('publicidade[estados_ids][]', estado.id.toString());
        });
      }

      if (formValue.imagem instanceof File) {
        formData.append('publicidade[imagem]', formValue.imagem);
      }

      const request = this.publicidadeSelecionada?.id
        ? this.publicidadeService.updateComImagem(this.publicidadeSelecionada.id, formData)
        : this.publicidadeService.createComImagem(formData);

      request.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Publicidade salva com sucesso!',
            life: 3000
          });
          
          this.exibirModal = false;
          this.carregarPublicidades();
        },
        error: (error) => {
          console.error('Erro ao salvar publicidade:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao salvar a publicidade. Tente novamente.',
            life: 5000
          });
        },
      });

    } catch (error) {
      console.error('Erro inesperado ao salvar:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro inesperado ao salvar. Tente novamente.',
        life: 5000
      });
    }
  }

  onEncerrar(id: number): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Confirmar Exclusão',
      detail: 'Tem certeza que deseja excluir esta publicidade? Esta ação não pode ser desfeita.',
      life: 0,
      sticky: true,
      closable: true,
      data: { id: id }
    });

    setTimeout(() => {
      const toastElement = document.querySelector('.p-toast-message:last-child .p-toast-message-content');
      if (toastElement) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'toast-buttons';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.className = 'toast-button cancel';
        cancelButton.style.padding = '6px 12px';
        cancelButton.style.border = '1px solid #ccc';
        cancelButton.style.backgroundColor = '#fff';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.onclick = () => {
          this.messageService.clear();
        };

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.className = 'toast-button confirm';
        confirmButton.style.padding = '6px 12px';
        confirmButton.style.border = 'none';
        confirmButton.style.backgroundColor = '#dc3545';
        confirmButton.style.color = 'white';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.onclick = () => {
          this.confirmarExclusao(id);
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        toastElement.appendChild(buttonContainer);
      }
    }, 100);
  }

  confirmarExclusao(id: number): void {
    this.messageService.clear();
    
    this.publicidadeService.deletePublicidade(id).subscribe({
      next: () => {
        this.carregarPublicidades();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Publicidade excluída com sucesso!',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Erro ao excluir publicidade:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível excluir a publicidade. Tente novamente mais tarde.',
          life: 5000
        });
      },
    });
  }

  onCancelar(): void {
    this.exibirModal = false;
  }

  limparDadosModal(): void {
    this.publicidadeSelecionada = null;
    this.imagemPreview = null;
    this.selectedFileName = '';
    this.publicidadeForm.reset();
  }

  carregarPublicidades(): void {
    this.publicidadeService.getPublicidades().subscribe({
      next: (data) => {
        console.log('Dados carregados:', data);
        this.publicidades = data;
        this.organizarPublicidades();
        this.aplicarFiltros(); // Aplicar filtros após carregar os dados
      },
      error: (error) => {
        console.error('Erro ao carregar publicidades:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar publicidades. Recarregue a página.',
          life: 5000
        });
      }
    });
  }

  organizarPublicidades(): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    this.publicidadesAtivas = [];
    this.publicidadesAgendadas = [];
    this.publicidadesEncerradas = [];

    this.publicidades.forEach(publicidade => {
      const inicio = new Date(publicidade.dt_inicio);
      const fim = new Date(publicidade.dt_fim);
      inicio.setHours(0, 0, 0, 0);
      fim.setHours(23, 59, 59, 999);

      if (hoje >= inicio && hoje <= fim) {
        this.publicidadesAtivas.push(publicidade);
      } else if (hoje < inicio) {
        this.publicidadesAgendadas.push(publicidade);
      } else {
        this.publicidadesEncerradas.push(publicidade);
      }
    });

    // Ordenar agendadas por data de início (mais próxima primeiro)
    this.publicidadesAgendadas.sort((a, b) => 
      new Date(a.dt_inicio).getTime() - new Date(b.dt_inicio).getTime()
    );

    // Ordenar encerradas por data de fim (mais recente primeiro)
    this.publicidadesEncerradas.sort((a, b) => 
      new Date(b.dt_fim).getTime() - new Date(a.dt_fim).getTime()
    );

    // Ordenar ativas por data de início
    this.publicidadesAtivas.sort((a, b) => 
      new Date(a.dt_inicio).getTime() - new Date(b.dt_inicio).getTime()
    );

    console.log('Publicidades organizadas:');
    console.log('Ativas:', this.publicidadesAtivas);
    console.log('Agendadas:', this.publicidadesAgendadas);
    console.log('Encerradas:', this.publicidadesEncerradas);
  }

  carregarEstados(): void {
    this.http.get<any[]>('http://localhost:3000/api/v1/estados').subscribe({
      next: (data: any[]) => {
        console.log('Estados carregados:', data);
        this.estados = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar estados:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar estados. Recarregue a página.',
          life: 5000
        });
      },
    });
  }

  formatarEstados(publicidade: any): string {
    if (!publicidade || !Array.isArray(publicidade.estados) || publicidade.estados.length === 0) {
      return 'Nenhum estado selecionado';
    }
    return publicidade.estados.map((estado: any) => estado.descricao).join(', ');
  }

  getStatusPublicidade(publicidade: any): { status: string, classe: string } {
    const hoje = new Date();
    const inicio = new Date(publicidade.dt_inicio);
    const fim = new Date(publicidade.dt_fim);

    if (hoje >= inicio && hoje <= fim) {
      return { status: 'Ativa', classe: 'status-ativa' };
    } else if (hoje < inicio) {
      return { status: 'Agendada', classe: 'status-agendada' };
    } else {
      return { status: 'Encerrada', classe: 'status-encerrada' };
    }
  }

  getDataFormatada(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}