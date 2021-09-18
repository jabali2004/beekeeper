import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { Apollo, gql, Query, QueryRef } from 'apollo-angular';
import { AddWorkerWindowComponent } from 'src/app/@core/components/windows/add-worker-window/add-worker-window.component';
import { EditWorkerWindowComponent } from 'src/app/@core/components/windows/edit-worker-window/edit-worker-window.component';
import PagedResponse from 'src/app/@core/types/PagedResponse';
import { UpdateWorkerReq, WorkerDTO, WorkerService } from 'src/app/api_client';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit, OnDestroy {
  // GraphQL

  public query: QueryRef<{ take: number; skip: number }>;
  public usePolling = false;

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
          address
          disabled
          online
          createdAt
          updatedAt
        }
      }
    }
  `;

  private workerByIdQuery = gql`
    query GetWorker($id: Uuid!) {
      workers(where: { id: { eq: $id } }) {
        totalCount
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
        items {
          id
          description
          name
          address
          disabled
          online
          createdAt
          updatedAt
        }
      }
    }
  `;

  // Pagination
  public totalCount: number;
  public currentPage = 1;
  public pageSize = 10;

  public workers: WorkerDTO[] = [];

  constructor(
    private apollo: Apollo,
    private windowService: NbWindowService,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void {
    this.queryWorkers(this.pageSize, 0);

    this.query.valueChanges.subscribe((res: any) => {
      if (res.data) {
        const workers = res.data.workers as PagedResponse<WorkerDTO>;
        this.workers = workers.items;
        this.totalCount = workers.totalCount;
      }
    });
  }

  /**
   * Start or stop polling
   */
  public updatePollingState(): void {
    this.usePolling = !this.usePolling;

    if (this.usePolling) {
      this.query.startPolling(10000);
    } else {
      this.query.stopPolling();
    }
  }

  /**
   * Open new window for creation
   */
  public createWorker() {
    this.windowService.open(AddWorkerWindowComponent, {
      title: 'Add new worker:',
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }

  /**
   * Delete worker and refresh
   */
  public deleteWorker(id: string) {
    this.workerService.apiWorkerIdDelete(id).subscribe(() => {
      this.query.refetch();
    });
  }

  public editWorker(id: string) {
    // TODO: Implement
    console.log(id);
    const worker: WorkerDTO = this.workers.find((w) => w.id === id);
    const updatedReq: UpdateWorkerReq = new UpdateWorkerReq(worker);

    this.windowService.open(EditWorkerWindowComponent, {
      title: 'Add new worker:',
      closeOnBackdropClick: false,
      closeOnEsc: true,
      context: {
        formGroup: updatedReq.getFormGroup()
      }
    });
  }

  /**
   * Change worker disabled state
   */
  public changeWorkerState(id: string) {
    const worker: WorkerDTO = this.workers.find((w) => w.id === id);
    const updatedReq: UpdateWorkerReq = new UpdateWorkerReq(worker);
    updatedReq.disabled = !updatedReq.disabled;

    this.workerService
      .apiWorkerIdPut(updatedReq.id, updatedReq)
      .subscribe(() => {
        this.queryWorkerById(id);
      });
  }

  /**
   * Paginate
   */
  public paginate(page: number) {
    this.currentPage = page;
    this.queryWorkers(this.pageSize, (this.currentPage - 1) * this.pageSize);
  }

  /**
   * Query worker by id
   */
  private queryWorkerById(id: string) {
    this.apollo
      .query({
        query: this.workerByIdQuery,
        variables: {
          id
        },
        fetchPolicy: 'network-only'
      })
      .subscribe();
  }

  /**
   * Query workers
   */
  private queryWorkers(take: number, skip: number) {
    this.query = this.apollo.watchQuery({
      query: this.workersQuery,
      variables: {
        take,
        skip
      }
    });
  }

  /**
   * Destroy and stop graphql polling
   */
  ngOnDestroy(): void {
    this.query.stopPolling();
  }
}
