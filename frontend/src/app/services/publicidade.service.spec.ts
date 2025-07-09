import { TestBed } from '@angular/core/testing';

import { PublicidadeService } from './publicidade.service';

describe('PublicidadeService', () => {
  let service: PublicidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  createComImagem(formData: FormData) {
  return this.http.post('http://localhost:3000/api/v1/publicidades', formData);
 }
});
