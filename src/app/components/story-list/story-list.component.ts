import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../../services/hacker-news.service';
import { Story } from 'src/app/models/Story.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {

  // #region Properties

  stories: Story[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  loading = false;

  private searchSubject = new Subject<string>();

  // #endregion

  constructor(private hackerNewsService: HackerNewsService) { }

  // #region Lifecycle Methods

  ngOnInit(): void {
    // this.setupSearchDebounce();
    this.getStoryPageCount();
  }

  // #endregion

  // #region Initialization

  /**
   * Sets up a debounced input listener to optimize search calls.
   */
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm = term;
      this.currentPage = 1;
      this.loadStories();
    });
  }

  // #endregion

  // #region API Call Methods

  /**
   * Fetches total story count from API and calculates pagination.
   */
  getStoryPageCount(): void {
    this.loading = true;
    this.hackerNewsService.getStoryCount(this.searchTerm).subscribe({
      next: (totalCount: number) => {
        this.totalPages = Math.ceil(totalCount / this.pageSize);
        this.currentPage = 1;
        this.loadStories();
      },
      error: (error) => {
        console.error('Error fetching story count:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Fetches current page of stories based on search, page, and page size.
   */
  loadStories(): void {
    this.loading = true;
    this.hackerNewsService.getStories(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (data: Story[]) => {
        debugger
        this.stories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching stories:', error);
        this.loading = false;
      }
    });
  }

  // #endregion

  // #region UI Interaction Handlers

  /**
   * Handles search input and triggers debounced update.
   */
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  /**
   * Changes page and loads stories for selected page.
   * @param page Page number to navigate to
   */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadStories();
  }

  /**
   * Shortcut method for going to a specific page (used in pagination).
   * @param page Desired page number
   */
  goToPage(page: number): void {
    this.changePage(page);
  }

  // #endregion

  // #region Pagination Helpers

  /**
   * Generates a list of visible page numbers for pagination control.
   * @returns List of page numbers
   */
  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const delta = 2;
    let startPage = Math.max(2, this.currentPage - delta);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + delta);

    visiblePages.push(1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    if (this.totalPages > 1 && !visiblePages.includes(this.totalPages)) {
      visiblePages.push(this.totalPages);
    }

    return visiblePages;
  }

  get showEllipsesBefore(): boolean {
    return this.currentPage > 3;
  }

  get showEllipsesAfter(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  /**
   * TrackBy function to optimize rendering of stories in ngFor.
   */
  trackByStoryId(index: number, story: Story): number {
    return story.id;
  }

  // #endregion
}
