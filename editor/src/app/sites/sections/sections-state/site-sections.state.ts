import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { SiteSectionStateModel } from './site-sections-state.model';
import { AppStateService } from '../../../app-state/app-state.service';
import { take } from 'rxjs/operators';

@State<SiteSectionStateModel[]>({
  name: 'siteSections',
  defaults: []
})
export class SiteSectionsState implements NgxsOnInit {
  constructor(private appStateService: AppStateService) {}
  ngxsOnInit({ setState }: StateContext<SiteSectionStateModel[]>) {
    this.appStateService.getInitialState('', 'site_sections').pipe(take(1)).subscribe((sections) => {
      setState(sections);
    });
  }
}
