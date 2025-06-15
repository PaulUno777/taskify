
export class CreateCategoryDto {
  name: string;
  color: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>
