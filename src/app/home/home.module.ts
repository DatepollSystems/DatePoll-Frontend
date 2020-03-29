import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FooterModule} from '../footer/footer.module';
import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, MaterialModule, TranslationModule, FooterModule, HomeRoutingModule],
  exports: [HomeComponent]
})
export class HomeModule {}
