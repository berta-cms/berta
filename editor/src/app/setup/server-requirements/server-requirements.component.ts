import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { finalize } from 'rxjs/operators';
import { UserState } from '../../user/user.state';
import {
  RequirementModel,
  RequirementsResponse,
} from './server-requirements.interface';
import { ServerRequirementsService } from './server-requirements.service';

interface RequirementGroup {
  title: string;
  failed: RequirementModel[];
  passed: RequirementModel[];
}

const DISMISSED_STORAGE_KEY = 'berta-server-requirements-dismissed';

/**
 * Blocking modal listing unmet server requirements. The API reports them only
 * while Berta is not installed, so after setup this never shows.
 *
 * Fatal failures block the editor until fixed, warnings can be dismissed for
 * the browser session.
 */
@Component({
  selector: 'berta-server-requirements',
  template: `
    @if (isVisible) {
      <div class="server-requirements-overlay"></div>
      <div
        class="server-requirements"
        role="dialog"
        aria-modal="true"
        aria-labelledby="server-requirements-title"
      >
        <h2 id="server-requirements-title">
          {{ hasFatal ? 'Take action!' : 'Almost there' }}
        </h2>
        @if (hasFatal) {
          <p>
            Berta has checked if it has everything it needs, and found problems
            with the server or the installation. Follow the suggestions below,
            then check again.
          </p>
        } @else {
          <p>
            Berta has checked if it has everything it needs. You can use Berta,
            but some features will not be available.
          </p>
        }

        @for (group of groups; track group.title) {
          @if (group.failed.length || group.passed.length) {
            <h3>{{ group.title }}</h3>
            <ul>
              @for (requirement of group.failed; track requirement.key) {
                <li
                  [class.fail]="requirement.fatal"
                  [class.warning]="!requirement.fatal"
                >
                  <span class="status">NO</span>
                  <div>
                    <div>{{ requirement.label }}</div>
                    <div class="message">{{ requirement.message }}</div>
                  </div>
                </li>
              }
              @if (showPassed) {
                @for (requirement of group.passed; track requirement.key) {
                  <li class="ok">
                    <span class="status">YES</span>
                    <div>{{ requirement.label }}</div>
                  </li>
                }
              }
            </ul>
          }
        }

        @if (passedCount) {
          <button
            type="button"
            class="toggle-passed"
            (click)="showPassed = !showPassed"
          >
            {{ showPassed ? 'Hide' : 'Show' }} {{ passedCount }} passed
            {{ passedCount === 1 ? 'check' : 'checks' }}
          </button>
        }

        <div class="actions">
          <button
            type="button"
            class="button"
            [class.inverse]="!hasFatal"
            [disabled]="isChecking"
            (click)="check()"
          >
            {{ isChecking ? 'Checking…' : 'Check again' }}
          </button>
          @if (!hasFatal) {
            <button type="button" class="button" (click)="continueAnyway()">
              Continue anyway
            </button>
          }
        </div>
      </div>
    }
  `,
  standalone: false,
})
export class ServerRequirementsComponent implements OnInit {
  groups: RequirementGroup[] = [];
  hasFatal = false;
  isVisible = false;
  isChecking = false;
  showPassed = false;
  passedCount = 0;

  constructor(
    private service: ServerRequirementsService,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.check();
  }

  check() {
    this.isChecking = true;
    this.service
      .check()
      .pipe(finalize(() => (this.isChecking = false)))
      .subscribe((response) => this.update(response));
  }

  continueAnyway() {
    try {
      sessionStorage.setItem(DISMISSED_STORAGE_KEY, '1');
    } catch {
      // Storage unavailable, dismiss for this page load only
    }
    this.isVisible = false;
  }

  private update(response: RequirementsResponse) {
    this.redirectToLogin(response);

    const requirements = response.installed ? [] : response.requirements;
    const failed = requirements.filter((requirement) => !requirement.ok);

    this.hasFatal = failed.some((requirement) => requirement.fatal);
    this.passedCount = requirements.length - failed.length;
    this.groups = [
      this.buildGroup('Server', 'server', requirements),
      this.buildGroup('Installation', 'installation', requirements),
    ];
    this.isVisible =
      failed.length > 0 && (this.hasFatal || !this.isDismissed());
  }

  /**
   * The editor's root route shows a blank preview while the site is not
   * installed, so logged out visitors go straight to the login screen.
   */
  private redirectToLogin(response: RequirementsResponse) {
    if (
      response.installed === false &&
      !this.store.selectSnapshot(UserState.isLoggedIn) &&
      this.router.url.split('?')[0] === '/'
    ) {
      this.router.navigate(['/login'], { queryParamsHandling: 'preserve' });
    }
  }

  private buildGroup(
    title: string,
    group: RequirementModel['group'],
    requirements: RequirementModel[],
  ): RequirementGroup {
    const inGroup = requirements.filter(
      (requirement) => requirement.group === group,
    );

    return {
      title,
      // Fatal failures first
      failed: inGroup
        .filter((requirement) => !requirement.ok)
        .sort((a, b) => Number(b.fatal) - Number(a.fatal)),
      passed: inGroup.filter((requirement) => requirement.ok),
    };
  }

  private isDismissed(): boolean {
    try {
      return sessionStorage.getItem(DISMISSED_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }
}
