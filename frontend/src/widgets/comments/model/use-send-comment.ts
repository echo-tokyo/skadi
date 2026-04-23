import { useCreateCommentMutation } from '@/entities/comment'
import { useMutationAction } from '@/shared/lib'

export const useSendComment = ({ id }: { id: number }) =>
  useMutationAction({
    mutation: useCreateCommentMutation(),
    prepare: (message: string) => ({ data: { message }, id }),
  })
