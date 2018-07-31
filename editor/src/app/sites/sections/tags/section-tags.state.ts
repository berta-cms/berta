import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';

import { AppStateService } from '../../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SectionTagsStateModel } from './section-tags-state.model';

@State<SectionTagsStateModel>({
  name: 'sectionTags',
  defaults: {}
})
export class SectionTagsState implements NgxsOnInit {
  constructor(private appStateService: AppStateService) {}
  ngxsOnInit({ setState }: StateContext<SectionTagsStateModel>) {
    this.appStateService.getInitialState('', 'section_tags').pipe(take(1)).subscribe((sections) => {
      setState(sections);
    });
  }
}