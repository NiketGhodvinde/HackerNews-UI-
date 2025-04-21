import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch stories', () => {
    const mockStories = [
      { id: 1, title: 'Test Story', url: 'https://example.com' }
    ];

    service.getStories('test', 1, 10).subscribe((stories) => {
      expect(stories.length).toBe(1);
      expect(stories[0].title).toBe('Test Story');
    });

    const req = httpMock.expectOne((r) => r.url?.includes('/api/stories'));
    expect(req.request.method).toBe('GET');
    req.flush(mockStories);
  });
});
