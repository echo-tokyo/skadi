import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

type MutationTuple<TArg> = readonly [
  (arg: TArg) => { unwrap: () => Promise<unknown> },
  { isLoading: boolean },
]

interface UseMutationActionConfig<TInput, TArg> {
  mutation: MutationTuple<TArg>
  prepare: (input: TInput) => TArg
  successMessage: string
}

export const useMutationAction = <TInput, TArg>(
  config: UseMutationActionConfig<TInput, TArg>,
) => {
  const [mutate, { isLoading }] = config.mutation

  const submit = async (input: TInput): Promise<boolean> => {
    try {
      await mutate(config.prepare(input)).unwrap()
      toast.info(config.successMessage)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { submit, isLoading }
}
