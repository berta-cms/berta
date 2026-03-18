import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';

import { AiAssistantState, AiMessage } from './ai-assistant.state';
import {
  SendAiMessageAction,
  ClearAiChatAction,
  ToggleAiAssistantAction,
} from './ai-assistant.actions';

@Component({
  selector: 'berta-ai-assistant',
  template: `
    @if (isOpen$ | async) {
      <div class="ai-panel">
        <div class="ai-panel-header">
          <span>AI Assistant</span>
          <div class="ai-panel-actions">
            <a href="#" (click)="clearChat($event)">Clear</a>
            <button (click)="close()" class="close-btn" aria-label="Close">
              ×
            </button>
          </div>
        </div>
        <div class="ai-messages" #messagesContainer>
          @if ((messages$ | async)?.length === 0) {
            <p class="ai-empty">
              Ask me to change design or site settings.<br />
              e.g. "Make the background dark blue" or "Set the page title to My
              Site"
            </p>
          }
          @for (msg of messages$ | async; track $index) {
            <div
              class="ai-message"
              [class.ai-message--user]="msg.role === 'user'"
              [class.ai-message--assistant]="msg.role === 'assistant'"
            >
              @if (msg.role === 'assistant') {
                <span [innerHTML]="msg.content | markdown"></span>
              } @else {
                {{ msg.content }}
              }
            </div>
          }
          @if (isLoading$ | async) {
            <div class="ai-message ai-message--assistant ai-message--loading">
              <span class="dot"></span><span class="dot"></span
              ><span class="dot"></span>
            </div>
          }
        </div>
        <div class="ai-input-area">
          <textarea
            #inputEl
            [(ngModel)]="inputText"
            placeholder="Ask me to change design or site settings..."
            (keydown.enter)="onEnter($event)"
            rows="3"
          ></textarea>
          <button
            (click)="send()"
            [disabled]="!inputText.trim() || (isLoading$ | async)"
          >
            Send
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ai-panel {
        position: fixed;
        top: 4.63em;
        right: 0;
        width: 320px;
        bottom: 8.5em;
        background: #fff;
        border-left: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        z-index: 2;
        box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
        font-family: inherit;
        font-size: 13px;
      }

      .ai-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75em 1em;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
        flex-shrink: 0;
      }

      .ai-panel-actions {
        display: flex;
        align-items: center;
        gap: 0.75em;
      }

      .ai-panel-actions a {
        font-size: 12px;
        color: #777;
        text-decoration: none;
      }

      .ai-panel-actions a:hover {
        color: #333;
      }

      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        color: #777;
        padding: 0;
      }

      .close-btn:hover {
        color: #333;
      }

      .ai-messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }

      .ai-empty {
        color: #aaa;
        font-size: 12px;
        text-align: center;
        margin: auto;
        line-height: 1.6;
      }

      .ai-message {
        max-width: 85%;
        padding: 0.5em 0.75em;
        border-radius: 8px;
        line-height: 1.5;
        word-break: break-word;
      }

      .ai-message--user {
        align-self: flex-end;
        background: #333;
        color: #fff;
      }

      .ai-message--assistant {
        align-self: flex-start;
        background: #f0f0f0;
        color: #333;
      }

      .ai-message--loading {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0.6em 0.75em;
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #999;
        animation: bounce 1.2s infinite ease-in-out;
      }

      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes bounce {
        0%,
        60%,
        100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-4px);
        }
      }

      .ai-input-area {
        padding: 0.75em;
        border-top: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        flex-shrink: 0;
      }

      .ai-input-area textarea {
        flex-grow: 1;
        resize: none;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0.5em;
        font-family: inherit;
        font-size: 12px;
        line-height: 1.4;
      }

      .ai-input-area textarea:focus {
        outline: none;
        border-color: #999;
      }

      .ai-input-area button {
        align-self: flex-start;
        padding: 0.4em 0.8em;
        background: #333;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        white-space: nowrap;
      }

      .ai-input-area button:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .ai-input-area button:hover:not(:disabled) {
        background: #555;
      }

      .ai-message--assistant p {
        margin: 0 0 0.4em;
      }

      .ai-message--assistant p:last-child {
        margin-bottom: 0;
      }

      .ai-message--assistant ul,
      .ai-message--assistant ol {
        margin: 0.3em 0;
        padding-left: 1.4em;
      }

      .ai-message--assistant code {
        background: #e8e8e8;
        border-radius: 3px;
        padding: 0.1em 0.3em;
        font-size: 11px;
      }

      .ai-message--assistant strong {
        font-weight: 600;
      }
    `,
  ],
  standalone: false,
})
export class AiAssistantComponent implements AfterViewChecked, OnDestroy {
  isOpen$: Observable<boolean>;
  messages$: Observable<AiMessage[]>;
  isLoading$: Observable<boolean>;
  inputText = '';

  @ViewChild('messagesContainer') private messagesContainer: ElementRef;
  @ViewChild('inputEl') private inputEl: ElementRef;

  private shouldFocus = false;
  private shouldScroll = false;
  private messageCount = 0;
  private subs: Subscription[] = [];

  constructor(private store: Store) {
    this.isOpen$ = this.store.select(AiAssistantState.isOpen);
    this.messages$ = this.store.select(AiAssistantState.messages);
    this.isLoading$ = this.store.select(AiAssistantState.isLoading);
    this.subs.push(
      this.isOpen$.subscribe((open) => {
        if (open) this.shouldFocus = true;
      }),
      this.messages$.subscribe((msgs) => {
        if (msgs.length > this.messageCount) this.shouldScroll = true;
        this.messageCount = msgs.length;
      }),
      this.isLoading$.subscribe((loading) => {
        if (loading) this.shouldScroll = true;
      }),
    );
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
    if (this.shouldFocus && this.inputEl) {
      this.inputEl.nativeElement.focus();
      this.shouldFocus = false;
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  send() {
    const text = this.inputText.trim();
    if (!text) {
      return;
    }
    this.inputText = '';
    this.store.dispatch(new SendAiMessageAction(text));
  }

  onEnter(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  clearChat(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ClearAiChatAction());
  }

  close() {
    this.store.dispatch(new ToggleAiAssistantAction());
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
