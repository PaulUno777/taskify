import { inject, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  private authService = inject(AuthService);

  messages$ = this.authService.currentUser$.pipe(
    filter((user) => !!user),
    switchMap(() => {
      this.connect();
      return this.socket$.asObservable();
    })
  );

  constructor(private auth: AuthService) {}

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      const token = localStorage.getItem('access_token');
      this.socket$ = webSocket({
        url: `${environment.WS_URL}/ws?token=${token}`,
        openObserver: {
          next: () => console.log('WebSocket connected'),
        },
        closeObserver: {
          next: () => console.log('WebSocket disconnected'),
        },
      });
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
