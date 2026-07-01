export function buildPagination(query) {
  const requestedPage = Number(query.page);
  const requestedLimit = Number(query.limit);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 50)
      : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
