
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = signal<boolean>(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode.set(savedTheme === 'dark');
      this.updateThemeClass();
    }
  }

  toggleTheme() {
    this.darkMode.update(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      this.updateThemeClass();
      return newMode;
    });
  }

  isDarkMode() {
    return this.darkMode.asReadonly();
  }

  private updateThemeClass() {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }
}