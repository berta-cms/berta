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
      <div class="ai-panel" [class.ai-panel--minimized]="isMinimized">
        <div
          class="ai-panel-header"
          [class.ai-panel-header--clickable]="isMinimized"
          (click)="isMinimized && restore()"
        >
          <span>AI Assistant</span>
          <div class="ai-panel-actions">
            @if (!isMinimized) {
              <a href="#" (click)="clearChat($event)">New chat</a>
            }
            <button
              (click)="$event.stopPropagation(); isMinimized ? restore() : minimize()"
              class="minimize-btn"
              [attr.aria-label]="isMinimized ? 'Restore' : 'Minimize'"
            >
              <svg
                class="drop-icon"
                [class.drop-icon--flipped]="isMinimized"
                width="8"
                height="5"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 1L4.75736 5.24264L0.514719 1"
                  stroke="#777"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              (click)="$event.stopPropagation(); close()"
              class="close-btn"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        @if (!isMinimized) {
          <div class="ai-messages" #messagesContainer>
            @if ((messages$ | async)?.length === 0) {
              <p class="ai-empty">
                Ask me to help with your content, design, or settings.<br />
                e.g. "Make the background dark blue" or "Set the page title to
                My Site"
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
            @if (dailyLimitMessage$ | async; as limitMessage) {
              <p class="ai-limit-message">{{ limitMessage }}</p>
            }
            <textarea
              #inputEl
              [(ngModel)]="inputText"
              placeholder="Ask me to help with your content, design, or settings..."
              (keydown.enter)="onEnter($event)"
              rows="3"
              [disabled]="!!(dailyLimitMessage$ | async)"
            ></textarea>
            <button
              (click)="send()"
              [disabled]="!inputText.trim() || (isLoading$ | async) || !!(dailyLimitMessage$ | async)"
            >
              Send
            </button>
          </div>
        }
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

      .minimize-btn {
        background: none;
        border: none;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        display: flex;
        align-items: center;
      }

      .minimize-btn:hover .drop-icon path {
        stroke: #333;
      }

      .drop-icon--flipped {
        transform: scaleY(-1);
      }

      .ai-panel--minimized {
        bottom: auto;
      }

      .ai-panel-header--clickable {
        cursor: pointer;
        user-select: none;
      }

      .ai-panel-header--clickable:hover {
        background: #f7f7f7;
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

      .ai-limit-message {
        margin: 0 0 0.5em;
        padding: 0.5em 0.75em;
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
        color: #856404;
        font-size: 12px;
        line-height: 1.4;
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
  dailyLimitMessage$: Observable<string | null>;
  inputText = '';
  isMinimized = false;

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
    this.dailyLimitMessage$ = this.store.select(AiAssistantState.dailyLimitMessage);
    this.subs.push(
      this.isOpen$.subscribe((open) => {
        if (open) this.shouldFocus = true;
      }),
      this.store.select(AiAssistantState.pendingInput).subscribe((text) => {
        if (text != null) this.inputText = text;
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

  minimize() {
    this.isMinimized = true;
  }

  restore() {
    this.isMinimized = false;
    this.shouldFocus = true;
    this.shouldScroll = true;
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
