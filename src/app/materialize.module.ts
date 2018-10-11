import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  MzBadgeModule,
  MzButtonModule,
  MzCardModule,
  MzCheckboxModule,
  MzChipModule,
  MzCollapsibleModule,
  MzCollectionModule,
  MzDatepickerModule,
  MzFeatureDiscoveryModule,
  MzDropdownModule,
  MzIconModule,
  MzIconMdiModule,
  MzInjectionModule,
  MzInputModule,
  MzMediaModule,
  MzModalModule,
  MzNavbarModule,
  MzParallaxModule,
  MzPaginationModule,
  MzProgressModule,
  MzRadioButtonModule,
  MzSelectModule,
  MzSidenavModule,
  MzSpinnerModule,
  MzSwitchModule,
  MzTabModule,
  MzTextareaModule,
  MzTimepickerModule,
  MzToastModule,
  MzTooltipModule,
  MzValidationModule
} from 'ngx-materialize';

const MZ_MODULES = [
  MzBadgeModule,
  MzButtonModule,
  MzCardModule,
  MzCheckboxModule,
  MzChipModule,
  MzCollapsibleModule,
  MzCollectionModule,
  MzDatepickerModule,
  MzFeatureDiscoveryModule,
  MzDropdownModule,
  MzIconModule,
  MzIconMdiModule,
  MzInjectionModule,
  MzInputModule,
  MzMediaModule,
  MzModalModule,
  MzNavbarModule,
  MzParallaxModule,
  MzPaginationModule,
  MzProgressModule,
  MzRadioButtonModule,
  MzSelectModule,
  MzSidenavModule,
  MzSpinnerModule,
  MzSwitchModule,
  MzTabModule,
  MzTextareaModule,
  MzTimepickerModule,
  MzToastModule,
  MzTooltipModule,
  MzValidationModule,
];

/* Deprecated */
@NgModule({
  imports: MZ_MODULES,
  exports: MZ_MODULES,
})
export class MaterializeComponentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MaterializeComponentModule,
    };
  }
}
