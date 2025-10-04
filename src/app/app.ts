import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkService } from './core/network/network';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (isNewVersionReady()) {
      <span>🆕 New version is available! Please reload the application.</span>
      <button (click)="reload()">Reload</button>
    }
    <h1>Welcome to {{ title() }}!!</h1>
    @if (network.isOffline()) {
      <span>🚫 Offline</span>
    }

    <router-outlet />
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly network = inject(NetworkService);
  private readonly swUpdate = inject(SwUpdate);

  protected readonly title = signal('PWA_TEMPLATE');
  protected readonly isNewVersionReady = signal(false);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter(event => event.type === 'VERSION_READY'))
        .subscribe((event: VersionReadyEvent) => {
          this.isNewVersionReady.set(true);
        });
    }
  }

  protected reload() {
    window.location.reload();
  }
}
