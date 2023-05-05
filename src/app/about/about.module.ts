import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {FooterModule} from '../footer/footer.module';
import {MaterialModule} from '../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {AboutRoutingModule} from './about-routing.module';

import {AboutComponent} from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, FooterModule, AboutRoutingModule],
  providers: [],
})
export class AboutModule {}
