import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneStudioComponent } from './scene-studio.component';

describe('SceneStudioComponent', () => {
  let component: SceneStudioComponent;
  let fixture: ComponentFixture<SceneStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneStudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
