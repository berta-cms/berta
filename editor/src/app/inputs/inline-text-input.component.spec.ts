import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InlineTextInputComponent } from './inline-text-input.component';
import { AutofocusDirective } from '../sites/shared/autofocus.directive';

describe('InlineTextInputComponent', () => {
  let fixture: ComponentFixture<InlineTextInputComponent>;
  let component: InlineTextInputComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InlineTextInputComponent, AutofocusDirective],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineTextInputComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('shows the value', () => {
    fixture.componentRef.setInput('value', 'Work');
    fixture.componentRef.setInput('placeholder', 'Type a title');
    fixture.detectChanges();

    const text = element.querySelector('.input-placeholder');
    expect(text.textContent.trim()).toBe('Work');
    expect(text.classList).not.toContain('is-empty');
  });

  it('shows the placeholder when the value is empty', () => {
    fixture.componentRef.setInput('value', '');
    fixture.componentRef.setInput('placeholder', 'Type a title');
    fixture.detectChanges();

    const text = element.querySelector('.input-placeholder');
    expect(text.textContent.trim()).toBe('Type a title');
    expect(text.classList).toContain('is-empty');
  });

  it('shows dots when the value and placeholder are empty', () => {
    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();

    expect(element.querySelector('.input-placeholder').textContent.trim()).toBe(
      '...',
    );
  });

  it('opens a focused input with the placeholder on startEditing', () => {
    fixture.componentRef.setInput('value', '');
    fixture.componentRef.setInput('placeholder', 'Type a title');
    fixture.detectChanges();

    component.startEditing();
    fixture.detectChanges();

    const input = element.querySelector('input');
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe('Type a title');
    expect(document.activeElement).toBe(input);
  });
});
