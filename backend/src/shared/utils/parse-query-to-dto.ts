import { FindAllForUserDto } from "src/task";

// parses ?sort=updatedAt:desc&page=1&limit=20&isCompleted=true
export function parseQueryToDto(query: any): FindAllForUserDto {
  const dto = new FindAllForUserDto();

  if (query.page) dto.page = parseInt(query.page, 10);
  if (query.limit) dto.limit = parseInt(query.limit, 10);

  if (query.sort) {
    // sort format: field:direction
    const [field, direction] = query.sort.split(":");
    if (
      field &&
      ["isCompleted", "dueDate", "updatedAt", "createdAt"].includes(field)
    ) {
      dto.sortBy = field as
        | "isCompleted"
        | "dueDate"
        | "updatedAt"
        | "createdAt";
      dto.sortDirection = direction?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    }
  }

  if (query.isCompleted !== undefined) {
    dto.isCompleted = query.isCompleted === "true";
  }

  if (query.priority) {
    if (["LOW", "MEDIUM", "HIGH"].includes(query.priority.toUpperCase())) {
      dto.priority = query.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH";
    }
  }

  if (query.categoryId) {
    dto.categoryId = parseInt(query.categoryId, 10);
  }

  if (query.dueFrom && query.dueTo) {
    dto.dueFrom = new Date(query.dueFrom);
    dto.dueTo = new Date(query.dueTo);
  }

  if (query.createdFrom && query.createdTo) {
    dto.createdFrom = new Date(query.createdFrom);
    dto.createdTo = new Date(query.createdTo);
  }

  if (query.updatedFrom && query.updatedTo) {
    dto.updatedFrom = new Date(query.updatedFrom);
    dto.updatedTo = new Date(query.updatedTo);
  }

  return dto;
}
