import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Apollo, gql, Query, QueryRef } from 'apollo-angular';
import PagedResponse from 'src/app/@core/types/PagedResponse';
import { Worker } from 'src/app/api_client';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {
  // GraphQL
  private workersQuery = gql`
    query GetWorkers($take: Int!, $skip: Int!) {
      workers(take: $take, skip: $skip) {
        totalCount
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
        items {
          id
          description
          name
        }
      }
    }
  `;

  public workers: Worker[];

  // Pagination
  public totalCount: number;
  public currentPage = 1;
  public pageSize = 10;

  private query: QueryRef<{ take: number; skip: number }>;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.queryWorkers(this.pageSize, 0);
  }

  public queryWorkers(take: number, skip: number) {
    this.apollo
      .query({
        query: this.workersQuery,
        variables: {
          take,
          skip
        }
      })
      .subscribe((res: any) => {
        if (res.data) {
          const workers = res.data.workers as PagedResponse<Worker>;
          this.workers = workers.items;
          this.totalCount = workers.totalCount;
        }
      });
  }

  public createWorker() {
    console.log('not implemented yet');
  }

  public paginate(page: number) {
    this.currentPage = page;
    this.queryWorkers(this.pageSize, (this.currentPage - 1) * this.pageSize);
  }
}
