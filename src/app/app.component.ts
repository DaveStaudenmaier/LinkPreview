import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';

export interface IlinkPreview {
  description: string;
  image: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  // Link array to display links.  You probably will want to put your link data in a database.
  links: Array<IlinkPreview> = [
    {
      title: 'Google',
      description: 'Search the worlds information, including webpages, images, videos and more. Google has many special features to help you find exactly what you are looking for.',
      url: 'https://www.google.com',
      image: 'http://www.google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png'
    }
  ];

  // JSON format returned from linkpreview.net
  preview: IlinkPreview = {
    title: '',
    description: '',
    url: '',
    image: ''
  };

  // Regular Expression for validating the link the user enters
  private regExHyperlink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  link = new FormControl('', [Validators.required, Validators.pattern(this.regExHyperlink)]);

  constructor(private http: HttpClient) {

  }


  // Gets preview JSON from linkpreview.net
  // It's free unless you do more than 60 requests per hour
  // You should probably create a service for this function
  getLinkPreview(link: string): Observable<any> {
    // Go to linkpreview.net to get your own key and place it below, replacing <key>
    const api = 'https://api.linkpreview.net/?key=<key>&q=' + link;

    return this.http.get(api);
  }


  onCancel() {
    this.preview = {
      title: '',
      description: '',
      url: '',
      image: ''
    };
    this.link.reset();
  }


  // Subscribe to link preview.  If errors because site not found, still to show the URL, even if we can't show a preview
  onPreview() {
    this.getLinkPreview(this.link.value)
    .subscribe(preview => {
      this.preview = preview;

      if (!this.preview.title) {
        this.preview.title = this.preview.url;
      }

    }, error => {
      this.preview.url = this.link.value;
      this.preview.title = this.preview.url;
    });
  }


  onSubmit() {
    this.links.push(this.preview);
    this.preview = {
      title: '',
      description: '',
      url: '',
      image: ''
    };
    this.link.reset();
  }

}
