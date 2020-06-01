import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {FooterModule} from '../footer/footer.module';
import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';
import {AboutRoutingModule} from './about-routing.module';

import {AboutComponent} from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, FooterModule, AboutRoutingModule],
  providers: []
})
export class AboutModule {}
