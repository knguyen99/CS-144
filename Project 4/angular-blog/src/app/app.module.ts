import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { BlogService } from './blog.service';
import { PreviewComponent } from './preview/preview.component';
@NgModule({
  declarations: [AppComponent, ListComponent, EditComponent, PreviewComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [BlogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
