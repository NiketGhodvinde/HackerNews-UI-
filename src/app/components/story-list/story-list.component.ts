import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../../services/hacker-news.service';
import { Story } from 'src/app/models/Story.model';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  stories: Story[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 10;
  loading = false;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    this.getStoryPageCount();
    this.loadStories();
  }

  getStoryPageCount() {
    this.hackerNewsService.getStoryCount().subscribe({
      next: (data) => {
        this.totalPages = Math.ceil(data / 10);
      },
      error: (error) => {
        console.error('Error fetching stories:', error);
        this.loading = false;
      }
    });
  }

  loadStories(): void {
    this.loading = true;
    this.hackerNewsService.getStories(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.stories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching stories:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadStories();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadStories();
  }

  public changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadStories();
  }

  public getVisiblePages(): number[] {
    const visiblePages = [];
    const delta = 2;
    let startPage = Math.max(2, this.currentPage - delta);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + delta);

    visiblePages.push(1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    if (this.totalPages > 1) {
      visiblePages.push(this.totalPages);
    }

    return visiblePages;
  }

  get showEllipsesBefore() {
    return this.currentPage > 3;
  }

  get showEllipsesAfter() {
    return this.currentPage < this.totalPages - 2;
  }
}
