import { AuthorsPrismaRepository } from '../repositories/authors-prisma.repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'

export namespace CreateAuthorUsecase {
  export type Input = {
    name: string
    email: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    createdAt: Date
  }
}
export class Usecase {
  constructor(private authorsRepository: AuthorsPrismaRepository) {}

  async execute(
    input: CreateAuthorUsecase.Input,
  ): Promise<CreateAuthorUsecase.Output> {
    const { name, email } = input
    if (!name || !email) {
      throw new BadRequestError('Input data not provided')
    }

    const authorExists = await this.authorsRepository.findByEmail(email)
    if (authorExists) {
      throw new ConflictError('Author already exists')
    }

    const author = await this.authorsRepository.create(input)
    return author
  }
}
