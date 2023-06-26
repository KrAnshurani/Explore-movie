import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface Movie {
  title: string;
  description: string;
  genres: string[];
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  isLoading: boolean = true;
  error: string = '';
  searchQuery: string = '';
  movies: Movie[] = [];
  selectedMovie: any = null;
  openMovieFlow: any = false;
  totalPages: any = 0;
  currentPage: any = 1;
  pages: any = []
  isDarkTheme = false;

 
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const accessToken = localStorage.getItem('auth-token');
    if (!accessToken) {
      this.router.navigate(['/'])
    }
    this.fetchMovies(1);
    this.loadTheme();

  }
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.saveTheme();
  }
 
  applyTheme() {
    const body = document.querySelector('body');
    body?.classList.toggle('dark-theme', this.isDarkTheme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('appTheme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  saveTheme() {
    const theme = this.isDarkTheme ? 'dark' : 'light';
    localStorage.setItem('appTheme', theme);
  }

  closeModal() {
    this.selectedMovie = null;
    this.openMovieFlow = false;
  }

  openModal(movie: any) {
    this.openMovieFlow = true;
    this.selectedMovie = movie;
  }
  getFilteredDataList() {
    return this.searchFilter(this.movies, this.searchQuery);
  }
  searchFilter(dataList: any[], searchQuery: string) {

    if (!searchQuery) {
      return dataList;
    }

    const filteredList = dataList.filter((item: any) => {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return filteredList;
  }
  fetchMovies(page: any) {
    this.openMovieFlow = false;
    this.closeModal();
    this.isLoading = true;
    this.currentPage = page;
    const accessToken = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + accessToken
    });
    let url = 'https://demo.credy.in/api/v1/maya/movies/'
    if (page == 1) {
      url = 'https://demo.credy.in/api/v1/maya/movies/'
    } else {
      url = 'https://demo.credy.in/api/v1/maya/movies?page=' + page
    }
    this.http.get<any>(url, { headers })
      .pipe(
        catchError(error => {
          this.error = 'Failed to fetch movies. Please try again.';
          this.isLoading = false;
          this.pages = []
          this.movies = []
          return throwError(error);
        })
      )
      .subscribe(response => {
        this.isLoading = false;
        this.movies = response.results;
        this.pages = Array.from(Array((page + 4) - page).keys()).map(i => page + i);
        this.error = ''
      });
  }

  searchMovies() {
    this.isLoading = true;
    this.error = '';

    const accessToken = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + accessToken
    });

    this.http.get<any>('https://demo.credy.in/api/v1/maya/movies/?search=' + this.searchQuery, { headers })
      .pipe(
        catchError(error => {
          this.error = 'Failed to search movies. Please try again.';
          this.isLoading = false;
          return throwError(error);
        })
      )
      .subscribe(response => {
        this.isLoading = false;
        this.movies = response.results;
      });
  }
  logout() {
    localStorage.removeItem('auth-token');
    this.router.navigate(['/'])
  }
}

