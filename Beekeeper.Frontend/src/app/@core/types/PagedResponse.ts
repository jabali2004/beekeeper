interface PagedResponse<T1> {
  totalCount: number;
  pageInfo: { hasPreviousPage: boolean; hasNextPage: boolean };
  items: T1[];
}

export default PagedResponse;
