import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { AiAssistantState, AiMessage } from './ai-assistant.state';
import {
  SendAiMessageAction,
  ClearAiChatAction,
  ToggleAiAssistantAction,
  SubmitAiFeedbackAction,
} from './ai-assistant.actions';
import { AppState } from '../app-state/app.state';

const EXAMPLE_PROMPTS = [
  'Make the background color light green',
  'Set the main heading to My Works',
  'Add a new section called Portfolio',
] as const;

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
              <div class="ai-empty">
                <p>Ask me to help with your content, design, or settings.<br />e.g.</p>
                <div class="ai-examples">
                  @for (prompt of examplePrompts; track prompt) {
                    <button class="ai-example-btn" (click)="selectExample(prompt)">{{ prompt }}</button>
                  }
                </div>
              </div>
            }
            @for (msg of messages$ | async; track $index) {
              <div
                class="ai-message"
                [class.ai-message--user]="msg.role === 'user'"
                [class.ai-message--assistant]="msg.role === 'assistant'"
              >
                @if (msg.role === 'assistant') {
                  <span [innerHTML]="msg.content | markdown"></span>
                  @if (hasFeedback$ | async) {
                    <div class="ai-feedback">
                      <button
                        class="ai-feedback-btn"
                        [class.ai-feedback-btn--active]="msg.vote === 'up'"
                        [disabled]="!!msg.vote"
                        (click)="submitFeedback($index, 'up')"
                        aria-label="Thumbs up"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button
                        class="ai-feedback-btn"
                        [class.ai-feedback-btn--active]="msg.vote === 'down'"
                        [disabled]="!!msg.vote"
                        (click)="submitFeedback($index, 'down')"
                        aria-label="Thumbs down"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  }
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

      .ai-examples {
        display: flex;
        flex-direction: column;
        gap: 0.4em;
        margin-top: 0.75em;
        align-items: center;
      }

      .ai-example-btn {
        background: none;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 0.3em 0.75em;
        font-size: 12px;
        color: #666;
        cursor: pointer;
        font-family: inherit;
      }

      .ai-example-btn:hover {
        background: #f0f0f0;
        color: #333;
        border-color: #bbb;
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

      .ai-feedback {
        display: flex;
        gap: 4px;
        margin-top: 6px;
      }

      .ai-feedback-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        color: #aaa;
        display: flex;
        align-items: center;
      }

      .ai-feedback-btn:hover:not(:disabled) {
        color: #555;
        background: #e4e4e4;
      }

      .ai-feedback-btn--active {
        color: #333;
      }

      .ai-feedback-btn:disabled {
        cursor: default;
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
  hasFeedback$: Observable<boolean>;
  inputText = '';
  isMinimized = false;
  readonly examplePrompts = EXAMPLE_PROMPTS;

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
    this.hasFeedback$ = this.store.select(AppState.getAiFeedbackUrl).pipe(map((url) => !!url));
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

  selectExample(prompt: string) {
    this.inputText = prompt;
    this.send();
  }

  clearChat(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ClearAiChatAction());
  }

  submitFeedback(messageIndex: number, vote: 'up' | 'down') {
    this.store.dispatch(new SubmitAiFeedbackAction(messageIndex, vote));
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
