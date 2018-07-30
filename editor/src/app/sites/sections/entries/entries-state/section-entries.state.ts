import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { take } from 'rxjs/operators';

import { AppStateService } from '../../../../app-state/app-state.service';
import { SectionEntriesStateModel } from './section-entries-state.model';

@State<SectionEntriesStateModel>({
  name: 'sectionEntries',
  defaults: {}
})
export class SectionEntriesState implements NgxsOnInit {
  constructor(private appStateService: AppStateService) {}
  ngxsOnInit({ setState }: StateContext<SectionEntriesStateModel>) {
    this.appStateService.getInitialState('', 'sectionEntries').pipe(take(1)).subscribe((sections) => {
      setState(sections);
    });
  }
}
